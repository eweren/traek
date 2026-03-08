import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) redirect(302, '/auth/signin');

	// Fetch the user's enterprise profile
	const { data: profile } = await db()
		.from('user_profiles')
		.select('tier, enterprise_seats, enterprise_trial_ends_at, stripe_customer_id')
		.eq('user_id', locals.user.id)
		.maybeSingle();

	if (profile?.tier !== 'enterprise') {
		redirect(302, '/app');
	}

	// Fetch enterprise licenses
	const { data: licenses } = await db()
		.from('enterprise_licenses')
		.select('id, license_key, seats, valid_until, revoked_at, metadata, created_at')
		.eq('user_id', locals.user.id)
		.order('created_at', { ascending: false });

	// Fetch seat assignments for all active licenses
	const activeLicenseIds = (licenses ?? [])
		.filter((l) => !l.revoked_at && new Date(l.valid_until) > new Date())
		.map((l) => l.id);

	const { data: seats } = activeLicenseIds.length
		? await db()
				.from('enterprise_seats')
				.select('id, license_id, email, assigned_at, revoked_at')
				.in('license_id', activeLicenseIds)
				.is('revoked_at', null)
				.order('assigned_at', { ascending: false })
		: { data: [] };

	// Usage stats: conversations count for the org
	const { count: conversationCount } = await db()
		.from('conversations')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', locals.user.id);

	const justUpgraded = url.searchParams.get('upgraded') === '1';

	return {
		profile: {
			tier: profile.tier as 'enterprise',
			seats: profile.enterprise_seats ?? 0,
			trialEndsAt: profile.enterprise_trial_ends_at ?? null
		},
		licenses: licenses ?? [],
		assignedSeats: seats ?? [],
		stats: {
			conversationCount: conversationCount ?? 0,
			assignedSeatCount: (seats ?? []).length,
			totalSeats: profile.enterprise_seats ?? 0
		},
		justUpgraded
	};
};
