/**
 * Lightweight analytics client for the Træk playground.
 *
 * Sends fire-and-forget events to POST /api/analytics.
 * Failures are swallowed silently so analytics never breaks UX.
 */

export type AnalyticsEvent =
	| 'playground_visit'
	| 'first_message_sent'
	| 'branch_created'
	| 'conversation_shared'
	| 'api_key_saved'
	| 'signup_completed';

export interface EventProperties {
	[key: string]: string | number | boolean | null | undefined;
}

export function track(event: AnalyticsEvent, properties?: EventProperties): void {
	fetch('/api/analytics', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ event, properties: properties ?? {} }),
		keepalive: true
	}).catch(() => {
		// silently ignore — analytics must never break user flows
	});
}
