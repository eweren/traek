/**
 * Traek custom icon set — 24×24 stroke-based SVG icons.
 * All icons use stroke="currentColor" and fill="none" unless noted.
 * strokeLinecap="round", strokeLinejoin="round", strokeWidth defaults to 2.
 */

export type IconName =
	| 'branch'
	| 'delete'
	| 'collapse'
	| 'expand'
	| 'search'
	| 'settings'
	| 'copy'
	| 'edit'
	| 'retry'
	| 'close'
	| 'check'
	| 'chevron-down'
	| 'chevron-up'
	| 'chevron-right'
	| 'chevron-left'
	| 'zoom-in'
	| 'zoom-out'
	| 'fit'
	| 'send'
	| 'filter'
	| 'node'
	| 'spinner'
	| 'warning'
	| 'compare'
	| 'undo'
	| 'redo';

export interface IconDef {
	/** SVG path data strings */
	paths: string[];
	/** Whether paths use fill="currentColor" instead of stroke */
	filled?: boolean;
	/** Override the default viewBox of "0 0 24 24" */
	viewBox?: string;
}

/**
 * Icon definitions.
 * Each entry maps an IconName to its SVG path(s) and options.
 * All stroke icons use currentColor, strokeWidth=2, round caps/joins.
 */
export const ICONS: Record<IconName, IconDef> = {
	/** Git-branch fork: node splits into two child paths */
	branch: {
		paths: [
			// Vertical line top to first fork
			'M6 3v4',
			// Circle at top
			'M6 3m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
			// Left branch down
			'M6 7c0 3 3 5 6 5',
			// Right branch (straight down)
			'M18 3v12',
			// Circle on right branch bottom
			'M18 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
			// Circle at left bottom
			'M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
			// Left branch continuing down
			'M6 12v7',
			// Curve from left to right branch at fork point
			'M12 12c3 0 6-2 6-9'
		]
	},

	/** Trash-bin delete icon */
	delete: {
		paths: [
			// Lid
			'M3 6h18',
			// Handle on lid
			'M8 6V4h8v2',
			// Bin body
			'M19 6l-1 14H6L5 6',
			// Left inner line
			'M10 11v6',
			// Right inner line
			'M14 11v6'
		]
	},

	/** Collapse: two chevrons pointing toward center */
	collapse: {
		paths: [
			// Top chevron pointing up
			'M8 8l4-4 4 4',
			// Bottom chevron pointing down
			'M8 16l4 4 4-4',
			// Center divider
			'M4 12h16'
		]
	},

	/** Expand: two chevrons pointing away from center */
	expand: {
		paths: [
			// Top chevron pointing down toward center
			'M8 4l4 4 4-4',
			// Bottom chevron pointing up toward center
			'M8 20l4-4 4 4',
			// Center divider
			'M4 12h16'
		]
	},

	/** Magnifying glass search */
	search: {
		paths: [
			// Circle
			'M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0',
			// Handle
			'M16 16l4 4'
		]
	},

	/** Gear/cog settings icon */
	settings: {
		paths: [
			// Outer gear body — 12 notch approximation via polygon-ish path
			'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
			// Gear teeth path
			'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
		]
	},

	/** Copy to clipboard */
	copy: {
		paths: [
			// Back rect
			'M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2',
			// Front rect
			'M16 4h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
		]
	},

	/** Pencil edit */
	edit: {
		paths: [
			// Pencil body
			'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
			// Pencil tip
			'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
		]
	},

	/** Refresh/retry circular arrow */
	retry: {
		paths: [
			// Arc
			'M1 4v6h6',
			// Full circle open arc
			'M3.51 15a9 9 0 1 0 .49-3.3'
		]
	},

	/** X close/dismiss */
	close: {
		paths: ['M18 6L6 18', 'M6 6l12 12']
	},

	/** Checkmark */
	check: {
		paths: ['M20 6L9 17l-5-5']
	},

	/** Chevron pointing down */
	'chevron-down': {
		paths: ['M6 9l6 6 6-6']
	},

	/** Chevron pointing up */
	'chevron-up': {
		paths: ['M18 15l-6-6-6 6']
	},

	/** Chevron pointing right */
	'chevron-right': {
		paths: ['M9 18l6-6-6-6']
	},

	/** Chevron pointing left */
	'chevron-left': {
		paths: ['M15 18l-6-6 6-6']
	},

	/** Zoom in — plus inside circle */
	'zoom-in': {
		paths: ['M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0', 'M11 8v6', 'M8 11h6', 'M16 16l4 4']
	},

	/** Zoom out — minus inside circle */
	'zoom-out': {
		paths: ['M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0', 'M8 11h6', 'M16 16l4 4']
	},

	/** Fit to screen — arrows pointing outward at corners */
	fit: {
		paths: [
			'M8 3H5a2 2 0 0 0-2 2v3',
			'M21 8V5a2 2 0 0 0-2-2h-3',
			'M3 16v3a2 2 0 0 0 2 2h3',
			'M16 21h3a2 2 0 0 0 2-2v-3'
		]
	},

	/** Paper-plane send */
	send: {
		paths: ['M22 2L11 13', 'M22 2L15 22l-4-9-9-4 20-7z']
	},

	/** Filter funnel */
	filter: {
		paths: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z']
	},

	/** Generic node/circle */
	node: {
		paths: ['M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0']
	},

	/** Animated spinner (single arc; animate rotation via CSS) */
	spinner: {
		paths: ['M12 2a10 10 0 0 1 10 10']
	},

	/** Warning triangle */
	warning: {
		paths: [
			'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
			'M12 9v4',
			'M12 17h.01'
		]
	},

	/** Side-by-side compare */
	compare: {
		paths: [
			'M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4',
			'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4',
			'M12 7v10',
			'M9 12H3',
			'M21 12h-6'
		]
	},

	/** Undo — counter-clockwise arrow */
	undo: {
		paths: ['M3 7v6h6', 'M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13']
	},

	/** Redo — clockwise arrow */
	redo: {
		paths: ['M21 7v6h-6', 'M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13']
	}
};
