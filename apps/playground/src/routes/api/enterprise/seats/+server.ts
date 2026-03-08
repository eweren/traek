import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db.js';
import type { RequestHandler } from './$types.js';

const addSeatSchema = z.object({
	email: z.string().email(),
	licenseId: z.string().uuid()
});

/**
 * POST /api/enterprise/seats
 * Assign a seat to a user email under a license.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const raw = await request.json().catch(() => ({}));
	const parsed = addSeatSchema.safeParse(raw);
	if (!parsed.success) {
		return json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
	}

	const { email, licenseId } = parsed.data;

	// Verify license belongs to this enterprise user
	const { data: license } = await db()
		.from('enterprise_licenses')
		.select('id, seats, valid_until, revoked_at')
		.eq('id', licenseId)
		.eq('user_id', locals.user.id)
		.maybeSingle();

	if (!license || license.revoked_at || new Date(license.valid_until) < new Date()) {
		return json({ error: 'Invalid or expired license' }, { status: 400 });
	}

	// Count active seats
	const { count } = await db()
		.from('enterprise_seats')
		.select('id', { count: 'exact', head: true })
		.eq('license_id', licenseId)
		.is('revoked_at', null);

	if ((count ?? 0) >= license.seats) {
		return json({ error: `Seat limit reached (${license.seats})` }, { status: 422 });
	}

	// Upsert seat (re-activate if previously revoked)
	const { data: seat, error } = await db()
		.from('enterprise_seats')
		.upsert({ license_id: licenseId, email, revoked_at: null }, { onConflict: 'license_id,email' })
		.select()
		.single();

	if (error) {
		console.error('Failed to add seat', error);
		return json({ error: 'Failed to add seat' }, { status: 500 });
	}

	return json({ seat }, { status: 201 });
};
