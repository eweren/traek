import { json } from '@sveltejs/kit';
import type Stripe from 'stripe';
import { stripe, priceIdToTier } from '$lib/server/stripe.js';
import { db } from '$lib/server/db.js';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request }) => {
	const sig = request.headers.get('stripe-signature');
	const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

	if (!sig || !webhookSecret) return json({ error: 'Missing signature' }, { status: 400 });

	let event: Stripe.Event;
	try {
		const body = await request.text();
		event = stripe().webhooks.constructEvent(body, sig, webhookSecret);
	} catch (err) {
		console.error('Webhook signature verification failed', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	switch (event.type) {
		case 'customer.subscription.created':
		case 'customer.subscription.updated': {
			const sub = event.data.object as Stripe.Subscription;
			const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
			const priceId = sub.items.data[0]?.price.id;
			const tier = priceId ? priceIdToTier(priceId) : 'free';
			const active = ['active', 'trialing'].includes(sub.status);
			const seats = sub.items.data[0]?.quantity ?? null;

			const update: Record<string, unknown> = {
				tier: active ? tier : 'free',
				stripe_subscription_id: sub.id
			};

			if (tier === 'enterprise' && active) {
				update.enterprise_seats = seats;
				if (sub.status === 'trialing' && sub.trial_end) {
					update.enterprise_trial_ends_at = new Date(sub.trial_end * 1000).toISOString();
				}
			} else {
				update.enterprise_seats = null;
				update.enterprise_trial_ends_at = null;
			}

			await db().from('user_profiles').update(update).eq('stripe_customer_id', customerId);
			break;
		}
		case 'customer.subscription.deleted': {
			const sub = event.data.object as Stripe.Subscription;
			const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
			await db()
				.from('user_profiles')
				.update({
					tier: 'free',
					stripe_subscription_id: null,
					enterprise_seats: null,
					enterprise_trial_ends_at: null
				})
				.eq('stripe_customer_id', customerId);
			break;
		}
		case 'invoice.payment_succeeded': {
			const inv = event.data.object as Stripe.Invoice;
			const customerId = typeof inv.customer === 'string' ? inv.customer : inv.customer?.id;
			if (customerId && inv.subscription) {
				console.info('[stripe] Enterprise invoice paid', {
					customerId,
					invoiceId: inv.id,
					amount: inv.amount_paid,
					currency: inv.currency
				});
			}
			break;
		}
	}

	return json({ received: true });
};
