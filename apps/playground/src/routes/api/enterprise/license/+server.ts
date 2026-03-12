import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db.js';
import { randomBytes } from 'node:crypto';
import type { RequestHandler } from './$types.js';

const generateLicenseKey = (): string => {
	// Format: TRK-XXXXXXXX-XXXXXXXX-XXXXXXXX (cryptographically secure)
	const part = () => randomBytes(4).toString('hex').toUpperCase();
	return `TRK-${part()}-${part()}-${part()}`;
};

const validateBodySchema = z.object({
	licenseKey: z.string().min(1)
});

const createBodySchema = z.object({
	seats: z.number().int().min(1).max(10_000),
	validMonths: z.number().int().min(1).max(24).default(12)
});

/**
 * POST /api/enterprise/license
 *
 * Creates a new enterprise license key for the authenticated user.
 * Only enterprise-tier users may call this.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	// Verify enterprise tier
	const { data: profile } = await db()
		.from('user_profiles')
		.select('tier, enterprise_seats')
		.eq('user_id', locals.user.id)
		.maybeSingle();

	if (profile?.tier !== 'enterprise') {
		return json({ error: 'Enterprise plan required' }, { status: 403 });
	}

	const raw = await request.json().catch(() => ({}));
	const parsed = createBodySchema.safeParse(raw);
	if (!parsed.success) {
		return json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
	}

	const { seats, validMonths } = parsed.data;
	const maxSeats = profile.enterprise_seats ?? seats;

	if (seats > maxSeats) {
		return json({ error: `Cannot exceed licensed seat count (${maxSeats})` }, { status: 422 });
	}

	const licenseKey = generateLicenseKey();
	const validUntil = new Date();
	validUntil.setMonth(validUntil.getMonth() + validMonths);

	const { data: license, error } = await db()
		.from('enterprise_licenses')
		.insert({
			user_id: locals.user.id,
			license_key: licenseKey,
			seats,
			valid_until: validUntil.toISOString()
		})
		.select()
		.single();

	if (error) {
		console.error('Failed to create license', error);
		return json({ error: 'Failed to create license' }, { status: 500 });
	}

	return json({ license }, { status: 201 });
};

/**
 * GET /api/enterprise/license?key=TRK-...
 *
 * Validates a license key. Public endpoint for SDK/self-hosted validation.
 */
export const GET: RequestHandler = async ({ url }) => {
	const key = url.searchParams.get('key');
	const parsed = validateBodySchema.safeParse({ licenseKey: key });

	if (!parsed.success) {
		return json({ valid: false, error: 'License key required' }, { status: 400 });
	}

	const { data: license } = await db()
		.from('enterprise_licenses')
		.select('id, seats, valid_until, revoked_at')
		.eq('license_key', parsed.data.licenseKey)
		.maybeSingle();

	if (!license) {
		return json({ valid: false, error: 'License not found' }, { status: 404 });
	}

	if (license.revoked_at) {
		return json({ valid: false, error: 'License revoked' }, { status: 403 });
	}

	if (new Date(license.valid_until) < new Date()) {
		return json({ valid: false, error: 'License expired' }, { status: 403 });
	}

	return json({
		valid: true,
		seats: license.seats,
		validUntil: license.valid_until
	});
};
