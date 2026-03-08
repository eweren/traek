import { z } from 'zod';

export const annotationColorSchema = z.enum([
	'yellow',
	'blue',
	'green',
	'pink',
	'orange',
	'amber',
	'red',
	'purple'
]);
export type AnnotationColor = z.infer<typeof annotationColorSchema>;

export const stickyAnnotationSchema = z.object({
	id: z.string(),
	type: z.literal('sticky'),
	x: z.number(),
	y: z.number(),
	width: z.number(),
	height: z.number(),
	color: annotationColorSchema,
	text: z.string(),
	rotation: z.number(),
	createdAt: z.string()
});
export type StickyAnnotation = z.infer<typeof stickyAnnotationSchema>;

export const markerAnnotationSchema = z.object({
	id: z.string(),
	type: z.literal('marker'),
	points: z.array(z.object({ x: z.number(), y: z.number() })),
	color: annotationColorSchema,
	strokeWidth: z.number(),
	createdAt: z.string()
});
export type MarkerAnnotation = z.infer<typeof markerAnnotationSchema>;

export const pinAnnotationSchema = z.object({
	id: z.string(),
	type: z.literal('pin'),
	x: z.number(),
	y: z.number(),
	label: z.string(),
	comment: z.string(),
	color: annotationColorSchema,
	createdAt: z.string()
});
export type PinAnnotation = z.infer<typeof pinAnnotationSchema>;

export const annotationSchema = z.discriminatedUnion('type', [
	stickyAnnotationSchema,
	markerAnnotationSchema,
	pinAnnotationSchema
]);
export type Annotation = z.infer<typeof annotationSchema>;

export type AnnotationTool = 'sticky' | 'marker' | 'pin' | 'eraser';

/** CSS color values keyed by AnnotationColor */
export const ANNOTATION_COLOR_VALUES: Record<AnnotationColor, string> = {
	yellow: '#fef08a',
	blue: '#bfdbfe',
	green: '#bbf7d0',
	pink: '#fbcfe8',
	orange: '#fed7aa',
	amber: '#fbbf24',
	red: '#fca5a5',
	purple: '#e9d5ff'
};

export const STICKY_COLORS: AnnotationColor[] = ['yellow', 'blue', 'green', 'pink', 'orange'];
export const MARKER_COLORS: AnnotationColor[] = ['amber', 'red', 'purple', 'blue', 'green'];
