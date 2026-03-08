import type { TraekTranslations } from '../types.js';

/** Chinese Simplified (简体中文) translations for the Traek Vue library. */
export const zh: TraekTranslations = {
	canvas: {
		viewportAriaLabel: '对话树',
		emptyStateTitle: '开始对话',
		emptyStateSubtitle: '在下方输入消息以开始',
		regenerateResponse: '重新生成回复',
		branchCelebration: '您创建了一个分支！探索不同的方向。',
		nodesDeleted: (count: number) => `已删除 ${count} 个节点`
	},
	input: {
		placeholder: '向专家提问...',
		sendAriaLabel: '发送消息',
		branchingFromSelected: '从选定消息创建分支',
		replyingToSelected: '回复选定消息',
		startingNewConversation: '开始新对话'
	},
	zoom: {
		zoomIn: '放大',
		zoomOut: '缩小',
		resetZoom: '重置缩放至 100%',
		fitAllNodes: '适应所有节点'
	},
	search: {
		placeholder: '搜索...',
		noMatches: '无匹配结果',
		previousMatch: '上一个匹配 (Shift+Enter)',
		nextMatch: '下一个匹配 (Enter)',
		closeSearch: '关闭搜索 (Escape)'
	},
	keyboard: {
		title: '键盘快捷键',
		navigationSection: '导航',
		navigateToParent: '移至父节点',
		navigateToFirstChild: '移至第一个子节点',
		navigateToPreviousSibling: '移至上一个兄弟节点',
		navigateToNextSibling: '移至下一个兄弟节点',
		goToRoot: '移至根节点',
		goToDeepestLeaf: '移至最深叶节点',
		actionsSection: '操作',
		activateFocusedNode: '激活焦点节点',
		toggleCollapseExpand: '折叠/展开',
		switchFocusToInput: '切换至输入焦点',
		showHideHelp: '显示/隐藏帮助',
		advancedSection: '高级',
		goToRootChord: '移至根节点（和弦）',
		goToDeepestLeafChord: '移至最深叶节点（和弦）',
		jumpToNthChild: '跳至第 n 个子节点',
		openFuzzySearch: '打开节点搜索',
		close: '关闭'
	},
	fuzzySearch: {
		placeholder: '输入以搜索节点...',
		ariaLabel: '搜索节点',
		noContent: '[无内容]',
		noMatchingNodes: '未找到匹配节点',
		resultCount: (count: number) => `${count} 个结果`,
		navigate: '导航',
		select: '选择'
	},
	nodeActions: {
		duplicate: '复制',
		delete: '删除',
		onlyThisNode: '仅此节点',
		withDescendants: (count: number) => `含 ${count} 个后代`,
		retry: '重试',
		edit: '编辑',
		copyBranch: '复制分支',
		compareBranches: '比较分支',
		branchCopied: '分支已复制到剪贴板',
		copyFailed: '复制到剪贴板失败'
	},
	textNode: {
		save: '保存',
		cancel: '取消',
		scrollForMore: '滚动查看更多 \u2193'
	},
	toast: {
		undo: '撤销',
		dismiss: '关闭'
	},
	onboarding: {
		welcomeTitle: '欢迎使用焦点模式',
		welcomeDescription: '用自然手势浏览您的对话',
		swipeUpTitle: '向上滑动',
		swipeUpDescription: '深入响应链',
		swipeDownTitle: '向下滑动',
		swipeDownDescription: '返回上一条消息',
		swipeSidewaysTitle: '横向滑动',
		swipeSidewaysDescription: '切换备选回复',
		keyboardTitle: '键盘快捷键',
		keyboardDescription: '使用这些键快速导航',
		keyboardNavigation: '导航',
		keyboardToRoot: '到根节点',
		keyboardInputFocus: '输入焦点',
		keyboardClose: '关闭',
		skip: '跳过',
		skipAriaLabel: '跳过教程',
		next: '下一步',
		letsGo: '开始吧！',
		tutorialProgress: '教程进度'
	},
	tour: {
		welcomeTitle: '欢迎使用 Tr\u00E6k',
		welcomeDescription: 'Tr\u00E6k 是一个空间对话界面。在画布上自由移动，探索分支对话。',
		sendMessageTitle: '发送消息',
		sendMessageDescription: '在此输入消息，按 Enter 发送。您的对话将以树形图形式显示在画布上。',
		createBranchTitle: '创建分支',
		createBranchDescription: '点击一条消息并发送新回复。您可以从同一点创建多个备选回复。',
		keyboardNavTitle: '键盘导航',
		keyboardNavDescription:
			'使用方向键（\u2191\u2193\u2190\u2192）导航，Home 键到根节点，"i" 聚焦输入，"?" 查看所有快捷键。',
		searchTitle: '搜索对话',
		searchDescription: '按 Ctrl+F（或 Cmd+F）搜索所有消息。按 Enter 在结果间导航。',
		compareBranchesTitle: '比较分支',
		compareBranchesDescription: '使用节点工具栏中的比较图标并排比较不同的响应路径。',
		readyTitle: '您已准备就绪！',
		readyDescription: '您可以随时从设置中重启导览。探索愉快！',
		skip: '跳过',
		skipAriaLabel: '跳过导览',
		back: '返回',
		next: '下一步',
		letsGo: '开始吧！',
		tourProgress: '导览进度'
	},
	breadcrumb: {
		showFullPath: '显示完整路径',
		defaultNodeText: '消息'
	},
	loading: {
		preparingCanvas: '正在准备 Tr\u00E6k 画布\u2026'
	},
	toolbar: {
		nodeActions: '节点操作'
	},
	replay: {
		stepBack: '后退一步',
		pause: '暂停',
		play: '播放',
		stepForward: '前进一步'
	}
};
