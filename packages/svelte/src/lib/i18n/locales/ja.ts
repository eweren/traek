import type { TraekTranslations } from '../types';

/** Japanese (日本語) translations for the Traek library. */
export const ja: TraekTranslations = {
	canvas: {
		viewportAriaLabel: '会話ツリー',
		emptyStateTitle: '会話を始める',
		emptyStateSubtitle: '下にメッセージを入力して開始',
		regenerateResponse: '回答を再生成',
		branchCelebration: 'ブランチを作成しました！様々な方向を探索してみましょう。',
		nodesDeleted: (count: number) => `${count}個のノードを削除しました`,
		gestureHintDrag: 'ドラッグでパン',
		gestureHintZoom: 'スクロールでズーム'
	},
	input: {
		placeholder: '質問してください...',
		sendAriaLabel: 'メッセージを送信',
		branchingFromSelected: '選択したメッセージからブランチ',
		replyingToSelected: '選択したメッセージに返信',
		startingNewConversation: '新しい会話を開始'
	},
	zoom: {
		zoomIn: 'ズームイン',
		zoomOut: 'ズームアウト',
		resetZoom: 'ズームを100%にリセット',
		fitAllNodes: '全ノードを表示',
		snapToGrid: 'グリッドスナップを切り替え',
		snapToGridEnabled: 'グリッド: オン',
		snapToGridDisabled: 'グリッド: オフ'
	},
	search: {
		placeholder: '検索...',
		noMatches: '一致なし',
		previousMatch: '前の一致 (Shift+Enter)',
		nextMatch: '次の一致 (Enter)',
		closeSearch: '検索を閉じる (Escape)'
	},
	keyboard: {
		title: 'キーボードショートカット',
		navigationSection: 'ナビゲーション',
		navigateToParent: '親ノードへ移動',
		navigateToFirstChild: '最初の子ノードへ移動',
		navigateToPreviousSibling: '前の兄弟ノードへ移動',
		navigateToNextSibling: '次の兄弟ノードへ移動',
		goToRoot: 'ルートノードへ移動',
		goToDeepestLeaf: '最も深い葉へ移動',
		actionsSection: 'アクション',
		activateFocusedNode: 'フォーカスしたノードをアクティブ化',
		toggleCollapseExpand: '折りたたみ/展開',
		switchFocusToInput: '入力フォーカス / 新規メッセージ',
		deleteFocusedNode: 'フォーカスしたノードを削除',
		fitAllNodes: '全ノードを表示',
		showHideHelp: 'ヘルプを表示/非表示',
		advancedSection: '詳細',
		goToRootChord: 'ルートへ移動 (コード)',
		goToDeepestLeafChord: '最も深い葉へ移動 (コード)',
		jumpToNthChild: 'n番目の子にジャンプ',
		openFuzzySearch: 'ノード検索を開く',
		openCommandPalette: 'コマンドパレットを開く',
		vimModeSection: 'Vimナビゲーション',
		vimNavigateUp: '親ノードへ移動',
		vimNavigateDown: '子ノードへ移動',
		vimNavigateLeft: '前の兄弟',
		vimNavigateRight: '次の兄弟',
		close: '閉じる'
	},
	fuzzySearch: {
		placeholder: 'ノードを検索...',
		ariaLabel: 'ノードを検索',
		noContent: '[コンテンツなし]',
		noMatchingNodes: '一致するノードが見つかりません',
		resultCount: (count: number) => `${count}件の結果`,
		navigate: '移動',
		select: '選択'
	},
	nodeActions: {
		duplicate: '複製',
		delete: '削除',
		onlyThisNode: 'このノードのみ',
		withDescendants: (count: number) => `${count}個の子孫を含む`,
		retry: '再試行',
		edit: '編集',
		copyBranch: 'ブランチをコピー',
		compareBranches: 'ブランチを比較',
		branchCopied: 'ブランチをクリップボードにコピーしました',
		copyFailed: 'クリップボードへのコピーに失敗しました'
	},
	textNode: {
		save: '保存',
		cancel: 'キャンセル',
		scrollForMore: 'スクロールしてさらに表示 \u2193'
	},
	toast: {
		undo: '元に戻す',
		dismiss: '閉じる'
	},
	onboarding: {
		welcomeTitle: 'フォーカスモードへようこそ',
		welcomeDescription: '自然なジェスチャーで会話をナビゲート',
		swipeUpTitle: '上にスワイプ',
		swipeUpDescription: '返信チェーンをさらに深く',
		swipeDownTitle: '下にスワイプ',
		swipeDownDescription: '前のメッセージに戻る',
		swipeSidewaysTitle: '横にスワイプ',
		swipeSidewaysDescription: '別の回答に切り替え',
		keyboardTitle: 'キーボードショートカット',
		keyboardDescription: 'これらのキーで素早くナビゲート',
		keyboardNavigation: 'ナビゲーション',
		keyboardToRoot: 'ルートへ',
		keyboardInputFocus: '入力フォーカス',
		keyboardClose: '閉じる',
		skip: 'スキップ',
		skipAriaLabel: 'チュートリアルをスキップ',
		next: '次へ',
		letsGo: '始めましょう！',
		tutorialProgress: 'チュートリアルの進捗'
	},
	mobile: {
		swipeUpHint: '上にスワイプしてさらに表示',
		swipeDownHint: '下にスワイプして戻る',
		swipeLeftHint: '前のブランチ',
		swipeRightHint: '次のブランチ'
	},
	tour: {
		welcomeTitle: 'Tr\u00E6kへようこそ',
		welcomeDescription:
			'Tr\u00E6kは空間的な会話インターフェースです。キャンバス上を自由に移動し、分岐した会話を探索しましょう。',
		panZoomTitle: 'キャンバスをナビゲート',
		panZoomDescription:
			'ドラッグでパン、スクロールでズーム（またはトラックパッドでピンチ）。Ctrl+スクロールで精密なズーム。隅のミニマップが現在位置を表示します。',
		sendMessageTitle: 'メッセージを送信',
		sendMessageDescription:
			'ここにメッセージを入力してEnterキーで送信。会話はキャンバス上のツリーとして表示されます。',
		createBranchTitle: 'ブランチを作成',
		createBranchDescription:
			'メッセージをクリックして新しい返答を送信。同じポイントから複数の代替回答を作成できます。',
		keyboardNavTitle: 'キーボードナビゲーション',
		keyboardNavDescription:
			'矢印キー(\u2191\u2193\u2190\u2192)でナビゲート、Homeでルートへ、「i」で入力フォーカス、「?」でショートカット一覧。',
		searchTitle: '会話を検索',
		searchDescription: 'Ctrl+F（またはCmd+F）で全メッセージを検索。Enterで結果間を移動。',
		compareBranchesTitle: 'ブランチを比較',
		compareBranchesDescription:
			'ノードツールバーの比較アイコンを使用して、異なる返答パスを並べて比較。',
		readyTitle: '準備完了！',
		readyDescription: '設定からいつでもツアーを再開できます。探索をお楽しみください！',
		skip: 'スキップ',
		skipAriaLabel: 'ツアーをスキップ',
		back: '戻る',
		next: '次へ',
		letsGo: '始めましょう！',
		tourProgress: 'ツアーの進捗'
	},
	breadcrumb: {
		showFullPath: 'フルパスを表示',
		defaultNodeText: 'メッセージ'
	},
	loading: {
		preparingCanvas: 'Tr\u00E6kキャンバスを準備中\u2026'
	},
	toolbar: {
		nodeActions: 'ノードアクション'
	},
	replay: {
		stepBack: '一歩戻る',
		pause: '一時停止',
		play: '再生',
		stepForward: '一歩進む'
	}
};
