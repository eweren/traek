import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db.js';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types.js';

const ticketSchema = z.object({
	subject: z.string().min(1).max(200),
	body: z.string().min(10).max(5000),
	severity: z.enum(['p0', 'p1', 'p2', 'p3']).default('p2')
});

const SEVERITY_LABELS: Record<string, string> = {
	p0: 'P0 — Critical',
	p1: 'P1 — High',
	p2: 'P2 — Standard',
	p3: 'P3 — Low'
};

/**
 * POST /api/enterprise/support
 *
 * Submit a support ticket. Enterprise-only — routes email to the enterprise
 * support inbox with SLA context attached.
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
	const parsed = ticketSchema.safeParse(raw);
	if (!parsed.success) {
		return json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
	}

	const { subject, body, severity } = parsed.data;
	const userEmail = (locals.user as unknown as { email: string }).email;
	const severityLabel = SEVERITY_LABELS[severity];
	const supportEmail = env.ENTERPRISE_SUPPORT_EMAIL ?? 'enterprise@gettraek.com';
	const from = env.RESEND_FROM ?? 'noreply@gettraek.com';

	if (!env.RESEND_API_KEY) {
		// Fallback: log and acknowledge (dev / no-email environment)
		console.info('[support] New enterprise ticket', { userEmail, severity, subject });
		return json({ ok: true, ticketId: `TICKET-${Date.now()}` });
	}

	const resend = new Resend(env.RESEND_API_KEY);

	const { error } = await resend.emails.send({
		from,
		to: supportEmail,
		replyTo: userEmail,
		subject: `[${severityLabel}] ${subject}`,
		html: `
<p><strong>From:</strong> ${userEmail}</p>
<p><strong>Severity:</strong> ${severityLabel}</p>
<p><strong>Seats licensed:</strong> ${profile.enterprise_seats ?? 'unknown'}</p>
<hr/>
<pre style="white-space:pre-wrap;font-family:inherit">${body}</pre>
`
	});

	if (error) {
		console.error('Failed to send support ticket email', error);
		return json({ error: 'Failed to submit ticket' }, { status: 500 });
	}

	// Log the event for audit purposes
	await db()
		.from('analytics_events')
		.insert({
			event: 'enterprise_support_ticket',
			user_id: locals.user.id,
			properties: { severity, subject: subject.slice(0, 100) }
		});

	return json({ ok: true });
};
