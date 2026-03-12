import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';

const EventSchema = z.object({
	event: z.string().min(1).max(64),
	properties: z.record(z.string(), z.unknown()).optional()
});

export const POST: RequestHandler = async ({ request, locals }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false }, { status: 400 });
	}

	const parsed = EventSchema.safeParse(body);
	if (!parsed.success) return json({ ok: false }, { status: 400 });

	const { event, properties } = parsed.data;

	// Best-effort insert — we never fail the response due to analytics
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (db() as any).from('analytics_events').insert({
			event,
			properties: properties ?? {},
			user_id: (locals as unknown as Record<string, unknown>).userId ?? null,
			created_at: new Date().toISOString()
		});
	} catch (err) {
		// Log but never surface analytics errors to the client
		console.error('[analytics] insert failed:', err);
	}

	return json({ ok: true });
};
