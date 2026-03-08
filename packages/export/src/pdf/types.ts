export interface PdfExportOptions {
	/** Title to display at the top of the PDF. Defaults to the snapshot title. */
	title?: string;
	/** Include metadata footer (export date, node count). Default: true. */
	includeMetadata?: boolean;
	/** Paper size. Default: 'a4'. */
	paperSize?: 'a4' | 'letter' | 'a3';
	/** Paper orientation. Default: 'portrait'. */
	orientation?: 'portrait' | 'landscape';
	/** Export mode.
	 * - 'linear': one thread per section, linearized top-to-bottom.
	 * - 'tree': visual tree diagram showing the full branch structure.
	 * Default: 'linear'.
	 */
	mode?: 'linear' | 'tree';
	/** Custom CSS to inject into the print document. */
	extraCss?: string;
}

export interface TreeLayoutNode {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	/** Column index (x) in the grid layout. */
	col: number;
	/** Row index (y) in the grid layout. */
	row: number;
	parentId: string | null;
}

export interface TreeLayout {
	nodes: TreeLayoutNode[];
	edges: Array<{ from: string; to: string }>;
	cols: number;
	rows: number;
}
