import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import type { RequestHandler } from './$types.js';

/**
 * DELETE /api/enterprise/seats/:seatId
 * Revoke a seat assignment.
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	// Verify the seat belongs to a license owned by this user
	const { data: seat } = await db()
		.from('enterprise_seats')
		.select('id, license_id')
		.eq('id', params.seatId)
		.maybeSingle();

	if (!seat) return json({ error: 'Seat not found' }, { status: 404 });

	const { data: license } = await db()
		.from('enterprise_licenses')
		.select('user_id')
		.eq('id', seat.license_id)
		.maybeSingle();

	if (license?.user_id !== locals.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	await db()
		.from('enterprise_seats')
		.update({ revoked_at: new Date().toISOString() })
		.eq('id', params.seatId);

	return json({ ok: true });
};
