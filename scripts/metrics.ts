/**
 * Træk adoption metrics reporter
 *
 * Fetches npm download stats and GitHub traction signals.
 * Run with: npx tsx scripts/metrics.ts
 *
 * Optional env vars:
 *   GITHUB_TOKEN — increases GitHub API rate limit from 60 to 5000 req/hr
 */

const PACKAGES = ['@traek/svelte', '@traek/react', '@traek/vue'];
const GITHUB_REPO = 'gettraek/traek';
const NPM_API = 'https://api.npmjs.org';
const GITHUB_API = 'https://api.github.com';

type Period = 'last-day' | 'last-week' | 'last-month';

interface NpmDownloads {
	downloads: number;
	start: string;
	end: string;
	package: string;
}

interface GitHubRepo {
	stargazers_count: number;
	forks_count: number;
	watchers_count: number;
	open_issues_count: number;
	subscribers_count: number;
	created_at: string;
	pushed_at: string;
}

async function fetchNpmDownloads(pkg: string, period: Period): Promise<number> {
	const encoded = encodeURIComponent(pkg);
	const res = await fetch(`${NPM_API}/downloads/point/${period}/${encoded}`);
	if (!res.ok) return 0;
	const data = (await res.json()) as NpmDownloads;
	return data.downloads ?? 0;
}

async function fetchNpmMonthlyTimeseries(
	pkg: string
): Promise<{ week: string; downloads: number }[]> {
	const encoded = encodeURIComponent(pkg);
	const end = new Date();
	const start = new Date();
	start.setDate(start.getDate() - 90);
	const startStr = start.toISOString().slice(0, 10);
	const endStr = end.toISOString().slice(0, 10);
	const res = await fetch(`${NPM_API}/downloads/range/${startStr}:${endStr}/${encoded}`);
	if (!res.ok) return [];
	const data = (await res.json()) as { downloads: { day: string; downloads: number }[] };
	if (!data.downloads) return [];

	// Bucket into weeks
	const weeks: Map<string, number> = new Map();
	for (const { day, downloads } of data.downloads) {
		const date = new Date(day);
		// Get Monday of this week
		const dayOfWeek = date.getDay();
		const diff = (dayOfWeek + 6) % 7;
		date.setDate(date.getDate() - diff);
		const weekKey = date.toISOString().slice(0, 10);
		weeks.set(weekKey, (weeks.get(weekKey) ?? 0) + downloads);
	}

	return Array.from(weeks.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([week, downloads]) => ({ week, downloads }));
}

async function fetchGitHubStats(): Promise<GitHubRepo | null> {
	const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
	const token = process.env.GITHUB_TOKEN;
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}`, { headers });
	if (!res.ok) {
		console.error(`GitHub API error: ${res.status} ${res.statusText}`);
		return null;
	}
	return res.json() as Promise<GitHubRepo>;
}

async function fetchGitHubStarHistory(): Promise<{ week: string; cumulative: number } | null> {
	// GitHub doesn't expose star history directly; we note the current count only.
	// For historical data, a paid service (star-history.com API, etc.) would be needed.
	return null;
}

function bar(value: number, max: number, width = 20): string {
	const filled = max > 0 ? Math.round((value / max) * width) : 0;
	return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function fmt(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
	return String(n);
}

async function main() {
	console.log('\n╔══════════════════════════════════════╗');
	console.log('║     Træk Adoption Metrics Report     ║');
	console.log(`║  ${new Date().toISOString().slice(0, 10)}                          ║`);
	console.log('╚══════════════════════════════════════╝\n');

	// ── npm downloads ──────────────────────────────────────────────────────────
	console.log('📦  npm Downloads\n');

	const periods: Period[] = ['last-day', 'last-week', 'last-month'];
	const totals = { day: 0, week: 0, month: 0 };

	for (const pkg of PACKAGES) {
		const [day, week, month] = await Promise.all(periods.map((p) => fetchNpmDownloads(pkg, p)));
		totals.day += day;
		totals.week += week;
		totals.month += month;
		console.log(`  ${pkg}`);
		console.log(`    Today    ${fmt(day).padStart(6)}`);
		console.log(`    7 days   ${fmt(week).padStart(6)}`);
		console.log(`    30 days  ${fmt(month).padStart(6)}\n`);
	}

	console.log('  ── Totals (all packages) ──');
	console.log(`    Today    ${fmt(totals.day).padStart(6)}`);
	console.log(`    7 days   ${fmt(totals.week).padStart(6)}`);
	console.log(`    30 days  ${fmt(totals.month).padStart(6)}\n`);

	// ── Weekly trend (primary package) ────────────────────────────────────────
	const primaryPkg = PACKAGES[0];
	const timeseries = await fetchNpmMonthlyTimeseries(primaryPkg!);
	if (timeseries.length > 0) {
		const maxWeekly = Math.max(...timeseries.map((w) => w.downloads));
		console.log(`\n  Weekly downloads trend (${primaryPkg}, last 13 wks)\n`);
		for (const { week, downloads } of timeseries.slice(-13)) {
			console.log(`    ${week}  ${bar(downloads, maxWeekly, 24)}  ${fmt(downloads)}`);
		}
	}

	// ── GitHub stats ───────────────────────────────────────────────────────────
	console.log('\n\n⭐  GitHub Stats\n');
	const gh = await fetchGitHubStats();
	if (gh) {
		console.log(`  Stars      ${fmt(gh.stargazers_count)}`);
		console.log(`  Forks      ${fmt(gh.forks_count)}`);
		console.log(`  Watchers   ${fmt(gh.watchers_count)}`);
		console.log(`  Open issues  ${gh.open_issues_count}`);
		console.log(`  Last push  ${gh.pushed_at.slice(0, 10)}`);
	} else {
		console.log('  (GitHub API unavailable — set GITHUB_TOKEN to increase rate limits)');
	}

	// ── Adoption funnel ────────────────────────────────────────────────────────
	console.log('\n\n🔀  Developer Adoption Funnel\n');
	console.log('  Docs visits          → tracked via Plausible (see dashboard)');
	console.log('  Playground signups   → check Supabase: SELECT COUNT(*) FROM users');
	console.log(
		"  BYOK configured      → SELECT COUNT(*) FROM analytics_events WHERE event = 'api_key_saved'"
	);
	console.log(
		"  First message sent   → SELECT COUNT(*) FROM analytics_events WHERE event = 'first_message_sent'"
	);
	console.log(
		"  Conversation shared  → SELECT COUNT(*) FROM analytics_events WHERE event = 'conversation_shared'"
	);
	console.log('\n  Run queries against your Supabase project to get exact funnel counts.\n');

	console.log('─'.repeat(42));
	console.log(`  Report generated at ${new Date().toISOString()}\n`);
}

main().catch((err) => {
	console.error('Error fetching metrics:', err);
	process.exit(1);
});
