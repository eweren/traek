import type { ConversationTemplate } from '../types';
import {
	brainstormingThumbnail,
	codeReviewThumbnail,
	researchThumbnail,
	debateThumbnail,
	creativeWritingThumbnail
} from './thumbnails';

const NOW = 1741392000000; // 2026-03-08 (stable for snapshots)

const brainstorming: ConversationTemplate = {
	id: 'brainstorming-tree',
	title: 'Brainstorming Tree',
	description:
		'Free-form idea generation with divergent branches. Start with a topic and explore multiple angles simultaneously.',
	category: 'brainstorming',
	svgThumbnail: brainstormingThumbnail,
	nodeCount: 6,
	defaultLayout: 'tree-vertical',
	snapshot: {
		version: 2,
		createdAt: NOW,
		title: 'Brainstorming Tree',
		activeNodeId: null,
		nodes: [
			{
				id: 'bt-1',
				parentIds: [],
				content: 'What is the central topic or challenge you want to explore?',
				role: 'system',
				type: 'text',
				status: 'done',
				createdAt: NOW,
				metadata: { x: 0, y: 0 }
			},
			{
				id: 'bt-2',
				parentIds: ['bt-1'],
				content: 'First angle or idea',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 1,
				metadata: { x: -200, y: 120 }
			},
			{
				id: 'bt-3',
				parentIds: ['bt-1'],
				content: 'Second angle or idea',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 2,
				metadata: { x: 200, y: 120 }
			},
			{
				id: 'bt-4',
				parentIds: ['bt-2'],
				content: "Let's dig deeper into this direction...",
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 3,
				metadata: { x: -200, y: 240 }
			},
			{
				id: 'bt-5',
				parentIds: ['bt-3'],
				content: "Let's dig deeper into this direction...",
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 4,
				metadata: { x: 200, y: 240 }
			},
			{
				id: 'bt-6',
				parentIds: ['bt-4'],
				content: 'What else could branch from here?',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 5,
				metadata: { x: -200, y: 360 }
			}
		]
	}
};

const codeReview: ConversationTemplate = {
	id: 'code-review-flow',
	title: 'Code Review Flow',
	description:
		'Structured code review: context → code → review → improvements. Branch into issues and positives.',
	category: 'code',
	svgThumbnail: codeReviewThumbnail,
	nodeCount: 8,
	defaultLayout: 'tree-vertical',
	snapshot: {
		version: 2,
		createdAt: NOW,
		title: 'Code Review Flow',
		activeNodeId: null,
		nodes: [
			{
				id: 'cr-1',
				parentIds: [],
				content: 'You are a code reviewer. Provide constructive, specific feedback.',
				role: 'system',
				type: 'text',
				status: 'done',
				createdAt: NOW,
				metadata: { x: 0, y: 0 }
			},
			{
				id: 'cr-2',
				parentIds: ['cr-1'],
				content: "Here is the code I'd like reviewed:\n\n[paste code here]",
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 1,
				metadata: { x: 0, y: 120 }
			},
			{
				id: 'cr-3',
				parentIds: ['cr-2'],
				content: "I'll review this systematically...",
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 2,
				metadata: { x: 0, y: 240 }
			},
			{
				id: 'cr-4',
				parentIds: ['cr-3'],
				content: 'Areas for improvement:',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 3,
				metadata: { x: -200, y: 360 }
			},
			{
				id: 'cr-5',
				parentIds: ['cr-3'],
				content: "What's working well:",
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 4,
				metadata: { x: 200, y: 360 }
			},
			{
				id: 'cr-6',
				parentIds: ['cr-4'],
				content: 'Can you explain the issue with [specific part]?',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 5,
				metadata: { x: -200, y: 480 }
			},
			{
				id: 'cr-7',
				parentIds: ['cr-6'],
				content: 'Sure, let me break this down...',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 6,
				metadata: { x: -200, y: 600 }
			},
			{
				id: 'cr-8',
				parentIds: ['cr-7'],
				content: "Here's my revised version:",
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 7,
				metadata: { x: -200, y: 720 }
			}
		]
	}
};

const research: ConversationTemplate = {
	id: 'research-exploration',
	title: 'Research Exploration',
	description:
		'Systematic research with balanced perspectives. Ask your question, explore multiple angles, then synthesise.',
	category: 'research',
	svgThumbnail: researchThumbnail,
	nodeCount: 5,
	defaultLayout: 'tree-horizontal',
	snapshot: {
		version: 2,
		createdAt: NOW,
		title: 'Research Exploration',
		activeNodeId: null,
		nodes: [
			{
				id: 're-1',
				parentIds: [],
				content:
					'You are a research assistant. Provide balanced perspectives, cite reasoning, and flag uncertainties.',
				role: 'system',
				type: 'text',
				status: 'done',
				createdAt: NOW,
				metadata: { x: 0, y: 0 }
			},
			{
				id: 're-2',
				parentIds: ['re-1'],
				content: 'Research question: [enter your question]',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 1,
				metadata: { x: 0, y: 120 }
			},
			{
				id: 're-3',
				parentIds: ['re-2'],
				content: 'Perspective 1: [economic / technical / historical / etc.]',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 2,
				metadata: { x: -200, y: 240 }
			},
			{
				id: 're-4',
				parentIds: ['re-2'],
				content: 'Perspective 2: [contrasting viewpoint]',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 3,
				metadata: { x: 200, y: 240 }
			},
			{
				id: 're-5',
				parentIds: ['re-3'],
				content: 'Synthesise these perspectives. What do we know for certain, what is contested?',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 4,
				metadata: { x: 0, y: 360 }
			}
		]
	}
};

const debate: ConversationTemplate = {
	id: 'debate-structure',
	title: 'Debate Structure',
	description:
		'Structured argument mapping — proposition, opposition, steelmanning. Explore both sides rigorously.',
	category: 'research',
	svgThumbnail: debateThumbnail,
	nodeCount: 7,
	defaultLayout: 'tree-horizontal',
	snapshot: {
		version: 2,
		createdAt: NOW,
		title: 'Debate Structure',
		activeNodeId: null,
		nodes: [
			{
				id: 'db-1',
				parentIds: [],
				content:
					'We will explore both sides of a debate. Present strongest arguments for each position fairly.',
				role: 'system',
				type: 'text',
				status: 'done',
				createdAt: NOW,
				metadata: { x: 0, y: 0 }
			},
			{
				id: 'db-2',
				parentIds: ['db-1'],
				content: 'Proposition: [state the claim or motion]',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 1,
				metadata: { x: 0, y: 120 }
			},
			{
				id: 'db-3',
				parentIds: ['db-2'],
				content: 'Arguments FOR the proposition:',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 2,
				metadata: { x: -200, y: 240 }
			},
			{
				id: 'db-4',
				parentIds: ['db-2'],
				content: 'Arguments AGAINST the proposition:',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 3,
				metadata: { x: 200, y: 240 }
			},
			{
				id: 'db-5',
				parentIds: ['db-3'],
				content: 'Steelman the FOR position — what is its absolute strongest version?',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 4,
				metadata: { x: -200, y: 360 }
			},
			{
				id: 'db-6',
				parentIds: ['db-4'],
				content: 'Steelman the AGAINST position — what is its absolute strongest version?',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 5,
				metadata: { x: 200, y: 360 }
			},
			{
				id: 'db-7',
				parentIds: ['db-5'],
				content: 'Given both steelmanned positions, what does an honest synthesis look like?',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 6,
				metadata: { x: 0, y: 480 }
			}
		]
	}
};

const creativeWriting: ConversationTemplate = {
	id: 'creative-writing-branches',
	title: 'Creative Writing Branches',
	description:
		'Branching narrative with alternate story paths. Build a world, then fork your story in multiple directions.',
	category: 'creative',
	svgThumbnail: creativeWritingThumbnail,
	nodeCount: 9,
	defaultLayout: 'tree-vertical',
	snapshot: {
		version: 2,
		createdAt: NOW,
		title: 'Creative Writing Branches',
		activeNodeId: null,
		nodes: [
			{
				id: 'cw-1',
				parentIds: [],
				content:
					'You are a creative collaborator. Write vivid, immersive prose that respects the story world we establish.',
				role: 'system',
				type: 'text',
				status: 'done',
				createdAt: NOW,
				metadata: { x: 0, y: 0 }
			},
			{
				id: 'cw-2',
				parentIds: ['cw-1'],
				content: 'Setting: [describe the world, time period, tone]',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 1,
				metadata: { x: 0, y: 120 }
			},
			{
				id: 'cw-3',
				parentIds: ['cw-2'],
				content: '[Opening scene — 2-3 paragraphs]',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 2,
				metadata: { x: 0, y: 240 }
			},
			{
				id: 'cw-4',
				parentIds: ['cw-3'],
				content: 'Path A: [describe one direction the story could go]',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 3,
				metadata: { x: -200, y: 360 }
			},
			{
				id: 'cw-5',
				parentIds: ['cw-3'],
				content: 'Path B: [describe an alternative direction]',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 4,
				metadata: { x: 200, y: 360 }
			},
			{
				id: 'cw-6',
				parentIds: ['cw-4'],
				content: '[Story continues down Path A...]',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 5,
				metadata: { x: -200, y: 480 }
			},
			{
				id: 'cw-7',
				parentIds: ['cw-5'],
				content: '[Story continues down Path B...]',
				role: 'assistant',
				type: 'text',
				status: 'done',
				createdAt: NOW + 6,
				metadata: { x: 200, y: 480 }
			},
			{
				id: 'cw-8',
				parentIds: ['cw-6'],
				content: 'Continue the story — introduce a complication',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 7,
				metadata: { x: -300, y: 600 }
			},
			{
				id: 'cw-9',
				parentIds: ['cw-6'],
				content: 'Jump forward in time — what changed?',
				role: 'user',
				type: 'text',
				status: 'done',
				createdAt: NOW + 8,
				metadata: { x: -100, y: 600 }
			}
		]
	}
};

export const builtinTemplates: ConversationTemplate[] = [
	brainstorming,
	codeReview,
	research,
	debate,
	creativeWriting
];
