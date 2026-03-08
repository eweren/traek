import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/auth/signin');

	const { data: profile } = await db()
		.from('user_profiles')
		.select('tier')
		.eq('user_id', locals.user.id)
		.maybeSingle();

	return {
		user: {
			id: locals.user.id,
			email: (locals.user as unknown as { email: string }).email
		},
		tier: (profile?.tier ?? 'free') as 'free' | 'pro' | 'team' | 'enterprise'
	};
};
