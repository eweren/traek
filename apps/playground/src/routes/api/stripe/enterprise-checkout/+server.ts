import { json } from '@sveltejs/kit';
import { z } from 'zod';
import Stripe from 'stripe';
import { stripe, ENTERPRISE_MIN_SEATS } from '$lib/server/stripe.js';
import { db } from '$lib/server/db.js';
import { env } from '$env/dynamic/private';
import { env as pubEnv } from '$env/dynamic/public';
import type { RequestHandler } from './$types.js';

const bodySchema = z.object({
	seats: z.number().int().min(ENTERPRISE_MIN_SEATS).max(10_000).default(ENTERPRISE_MIN_SEATS),
	/** Whether to start a 14-day trial before billing. */
	trial: z.boolean().default(true)
});

/**
 * POST /api/stripe/enterprise-checkout
 *
 * Creates a Stripe Checkout session for the enterprise plan with:
 * - Annual billing (invoice mode)
 * - Seat quantity selection
 * - Optional 14-day trial
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const raw = await request.json().catch(() => ({}));
	const parsed = bodySchema.safeParse(raw);
	if (!parsed.success) {
		return json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
	}
	const { seats, trial } = parsed.data;

	if (!env.STRIPE_ENTERPRISE_PRICE_ID) {
		return json({ error: 'Enterprise plan not configured' }, { status: 503 });
	}

	const userEmail = (locals.user as unknown as { email: string }).email;
	const appUrl = pubEnv.PUBLIC_APP_URL ?? env.PUBLIC_APP_URL ?? 'http://localhost:5173';

	// Get or create Stripe customer
	const { data: profile } = await db()
		.from('user_profiles')
		.select('stripe_customer_id')
		.eq('user_id', locals.user.id)
		.maybeSingle();

	let customerId = profile?.stripe_customer_id as string | undefined;
	if (!customerId) {
		const customer = await stripe().customers.create({
			email: userEmail,
			metadata: { traek_user_id: locals.user.id }
		});
		customerId = customer.id;
		await db()
			.from('user_profiles')
			.upsert(
				{ user_id: locals.user.id, stripe_customer_id: customerId },
				{ onConflict: 'user_id' }
			);
	}

	const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
		metadata: { seats: String(seats) }
	};
	if (trial) subscriptionData.trial_period_days = 14;

	const session = await stripe().checkout.sessions.create({
		customer: customerId,
		mode: 'subscription',
		line_items: [{ price: env.STRIPE_ENTERPRISE_PRICE_ID, quantity: seats }],
		success_url: `${appUrl}/app/enterprise-admin?upgraded=1`,
		cancel_url: `${appUrl}/enterprise`,
		subscription_data: subscriptionData,
		payment_method_collection: 'if_required',
		billing_address_collection: 'required',
		tax_id_collection: { enabled: true },
		invoice_creation: { enabled: true }
	});

	return json({ url: session.url });
};
