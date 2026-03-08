/**
 * SVG thumbnail schematics for built-in templates.
 * Statically authored — no runtime rendering cost.
 * Node colours: user = blue-tinted, assistant = green-tinted, system = muted.
 */

const BG = '#141414';
const SYSTEM_FILL = '#1e1e1e';
const SYSTEM_STROKE = '#555555';
const USER_FILL = '#0d1a2a';
const USER_STROKE = '#1e6fa8';
const ASST_FILL = '#0a1f14';
const ASST_STROKE = '#1a8c4e';
const EDGE = '#444444';
const RX = '5';

function rect(x: number, y: number, w: number, h: number, role: 'system' | 'user' | 'asst') {
	const fill = role === 'system' ? SYSTEM_FILL : role === 'user' ? USER_FILL : ASST_FILL;
	const stroke = role === 'system' ? SYSTEM_STROKE : role === 'user' ? USER_STROKE : ASST_STROKE;
	return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${RX}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
}

function line(x1: number, y1: number, x2: number, y2: number) {
	return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${EDGE}" stroke-width="1.2"/>`;
}

function svg(w: number, h: number, content: string) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="background:${BG}" aria-hidden="true">${content}</svg>`;
}

/** Brainstorming Tree: 1 root → 2 branches → 2 leaves → 1 more leaf */
export const brainstormingThumbnail = svg(
	220,
	160,
	[
		// Root (system)
		rect(80, 10, 60, 22, 'system'),
		// Lines from root to children
		line(110, 32, 55, 65),
		line(110, 32, 165, 65),
		// Children (user)
		rect(25, 65, 60, 22, 'user'),
		rect(135, 65, 60, 22, 'user'),
		// Lines to assistants
		line(55, 87, 55, 115),
		line(165, 87, 165, 115),
		// Assistants
		rect(25, 115, 60, 22, 'asst'),
		rect(135, 115, 60, 22, 'asst'),
		// Line to extra user
		line(55, 137, 55, 153),
		rect(25, 153, 60, 0, 'user') // just the connector hint
	].join('')
);

/** Code Review Flow: linear chain with one branch */
export const codeReviewThumbnail = svg(
	220,
	160,
	[
		rect(80, 8, 60, 18, 'system'),
		line(110, 26, 110, 44),
		rect(80, 44, 60, 18, 'user'),
		line(110, 62, 110, 80),
		rect(80, 80, 60, 18, 'asst'),
		// branch
		line(110, 98, 60, 112),
		line(110, 98, 160, 112),
		rect(30, 112, 60, 18, 'asst'),
		rect(130, 112, 60, 18, 'asst'),
		line(60, 130, 60, 144),
		rect(30, 144, 60, 14, 'user')
	].join('')
);

/** Research Exploration: system → question → 2 perspectives → synthesis */
export const researchThumbnail = svg(
	220,
	160,
	[
		rect(80, 10, 60, 18, 'system'),
		line(110, 28, 110, 46),
		rect(80, 46, 60, 18, 'user'),
		line(110, 64, 60, 82),
		line(110, 64, 160, 82),
		rect(30, 82, 60, 18, 'asst'),
		rect(130, 82, 60, 18, 'asst'),
		line(60, 100, 110, 128),
		rect(80, 128, 60, 18, 'user')
	].join('')
);

/** Debate Structure: proposition → for/against → steelman → synthesis */
export const debateThumbnail = svg(
	220,
	160,
	[
		rect(80, 8, 60, 18, 'system'),
		line(110, 26, 110, 42),
		rect(80, 42, 60, 18, 'user'),
		line(110, 60, 55, 76),
		line(110, 60, 165, 76),
		rect(25, 76, 60, 18, 'asst'),
		rect(135, 76, 60, 18, 'asst'),
		line(55, 94, 55, 110),
		line(165, 94, 165, 110),
		rect(25, 110, 60, 18, 'user'),
		rect(135, 110, 60, 18, 'user'),
		line(55, 128, 110, 142),
		rect(80, 142, 60, 16, 'user')
	].join('')
);

/** Creative Writing Branches: story → scene → 2 narrative paths */
export const creativeWritingThumbnail = svg(
	220,
	160,
	[
		rect(80, 8, 60, 18, 'system'),
		line(110, 26, 110, 42),
		rect(80, 42, 60, 18, 'user'),
		line(110, 60, 110, 76),
		rect(80, 76, 60, 18, 'asst'),
		line(110, 94, 55, 108),
		line(110, 94, 165, 108),
		rect(25, 108, 60, 18, 'user'),
		rect(135, 108, 60, 18, 'user'),
		line(55, 126, 55, 140),
		line(165, 126, 165, 140),
		rect(25, 140, 60, 18, 'asst'),
		rect(135, 140, 60, 18, 'asst')
	].join('')
);
