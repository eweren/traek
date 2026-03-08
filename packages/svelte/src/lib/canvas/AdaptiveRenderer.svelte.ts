/**
 * Adaptive rendering utility for zoom-based detail levels.
 * Determines how much detail to show for nodes based on viewport scale.
 */

export type DetailLevel = 'full' | 'compact' | 'minimal' | 'dot';

/**
 * Calculate the appropriate detail level based on viewport scale.
 *
 * @param scale - Current viewport scale (zoom level)
 * @returns DetailLevel - 'full' (>0.5), 'compact' (0.25-0.5), 'minimal' (0.12-0.25), or 'dot' (≤0.12)
 *
 * @example
 * getDetailLevel(1.0) // 'full' - normal zoom, show all details
 * getDetailLevel(0.6) // 'full' - still readable at 60% zoom
 * getDetailLevel(0.35) // 'compact' - medium zoom, show first line only
 * getDetailLevel(0.18) // 'minimal' - far zoom, show colored block with role
 * getDetailLevel(0.08) // 'dot' - very far zoom, show tiny colored dot
 */
export function getDetailLevel(scale: number): DetailLevel {
	if (scale > 0.5) return 'full';
	if (scale > 0.25) return 'compact';
	if (scale > 0.12) return 'minimal';
	return 'dot';
}
