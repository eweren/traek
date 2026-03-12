import type { TraekTranslations } from '../types.js';

/** German (Deutsch) translations for the Traek Vue library. */
export const de: TraekTranslations = {
	canvas: {
		viewportAriaLabel: 'Gesprächsbaum',
		emptyStateTitle: 'Gespräch starten',
		emptyStateSubtitle: 'Nachricht unten eingeben, um zu beginnen',
		regenerateResponse: 'Antwort neu generieren',
		branchCelebration: 'Du hast einen Ast erstellt! Erkunde verschiedene Richtungen.',
		nodesDeleted: (count: number) => `${count} Knoten gelöscht`
	},
	input: {
		placeholder: 'Frage stellen...',
		sendAriaLabel: 'Nachricht senden',
		branchingFromSelected: 'Ast von ausgewählter Nachricht',
		replyingToSelected: 'Antwort auf ausgewählte Nachricht',
		startingNewConversation: 'Neues Gespräch starten'
	},
	zoom: {
		zoomIn: 'Hineinzoomen',
		zoomOut: 'Herauszoomen',
		resetZoom: 'Zoom auf 100 % zurücksetzen',
		fitAllNodes: 'Alle Knoten einpassen'
	},
	search: {
		placeholder: 'Suchen...',
		noMatches: 'Keine Treffer',
		previousMatch: 'Vorheriger Treffer (Shift+Enter)',
		nextMatch: 'Nächster Treffer (Enter)',
		closeSearch: 'Suche schließen (Escape)'
	},
	keyboard: {
		title: 'Tastenkombinationen',
		navigationSection: 'Navigation',
		navigateToParent: 'Zum übergeordneten Knoten',
		navigateToFirstChild: 'Zum ersten untergeordneten Knoten',
		navigateToPreviousSibling: 'Zum vorherigen Geschwisterknoten',
		navigateToNextSibling: 'Zum nächsten Geschwisterknoten',
		goToRoot: 'Zum Wurzelknoten',
		goToDeepestLeaf: 'Zum tiefsten Blatt',
		actionsSection: 'Aktionen',
		activateFocusedNode: 'Fokussierten Knoten aktivieren',
		toggleCollapseExpand: 'Ein-/Ausklappen',
		switchFocusToInput: 'Eingabe fokussieren',
		showHideHelp: 'Hilfe ein-/ausblenden',
		advancedSection: 'Erweitert',
		goToRootChord: 'Zur Wurzel (Akkord)',
		goToDeepestLeafChord: 'Zum tiefsten Blatt (Akkord)',
		jumpToNthChild: 'Zum n-ten Kind springen',
		openFuzzySearch: 'Knotensuche öffnen',
		close: 'Schließen'
	},
	fuzzySearch: {
		placeholder: 'Tippen um Knoten zu suchen...',
		ariaLabel: 'Knoten suchen',
		noContent: '[Kein Inhalt]',
		noMatchingNodes: 'Keine passenden Knoten gefunden',
		resultCount: (count: number) => `${count} Ergebnis${count !== 1 ? 'se' : ''}`,
		navigate: 'Navigieren',
		select: 'Auswählen'
	},
	nodeActions: {
		duplicate: 'Duplizieren',
		delete: 'Löschen',
		onlyThisNode: 'Nur diesen Knoten',
		withDescendants: (count: number) => `Mit ${count} Nachfolger${count !== 1 ? 'n' : ''}`,
		retry: 'Wiederholen',
		edit: 'Bearbeiten',
		copyBranch: 'Ast kopieren',
		compareBranches: 'Äste vergleichen',
		branchCopied: 'Ast in Zwischenablage kopiert',
		copyFailed: 'Kopieren fehlgeschlagen'
	},
	textNode: {
		save: 'Speichern',
		cancel: 'Abbrechen',
		scrollForMore: 'Scrollen für mehr \u2193'
	},
	toast: {
		undo: 'Rückgängig',
		dismiss: 'Schließen'
	},
	onboarding: {
		welcomeTitle: 'Willkommen im Fokusmodus',
		welcomeDescription: 'Navigiere dein Gespräch mit natürlichen Gesten',
		swipeUpTitle: 'Nach oben wischen',
		swipeUpDescription: 'Tiefer in die Antwortkette',
		swipeDownTitle: 'Nach unten wischen',
		swipeDownDescription: 'Zurück zur vorherigen Nachricht',
		swipeSidewaysTitle: 'Seitlich wischen',
		swipeSidewaysDescription: 'Zwischen alternativen Antworten wechseln',
		keyboardTitle: 'Tastenkombinationen',
		keyboardDescription: 'Verwende diese Tasten zur schnellen Navigation',
		keyboardNavigation: 'Navigation',
		keyboardToRoot: 'Zur Wurzel',
		keyboardInputFocus: 'Eingabe-Fokus',
		keyboardClose: 'Schließen',
		skip: 'Überspringen',
		skipAriaLabel: 'Tutorial überspringen',
		next: 'Weiter',
		letsGo: "Los geht's!",
		tutorialProgress: 'Tutorial-Fortschritt'
	},
	tour: {
		welcomeTitle: 'Willkommen bei Tr\u00E6k',
		welcomeDescription:
			'Tr\u00E6k ist eine räumliche Konversationsschnittstelle. Bewege dich frei auf der Leinwand und erkunde verzweigte Gespräche.',
		sendMessageTitle: 'Nachricht senden',
		sendMessageDescription:
			'Tippe deine Nachricht hier und drücke Enter zum Senden. Dein Gespräch wird als Baum auf der Leinwand angezeigt.',
		createBranchTitle: 'Ast erstellen',
		createBranchDescription:
			'Klicke auf eine Nachricht und sende eine neue Antwort. Du kannst mehrere alternative Antworten vom gleichen Punkt erstellen.',
		keyboardNavTitle: 'Tastaturnavigation',
		keyboardNavDescription:
			'Verwende Pfeiltasten (\u2191\u2193\u2190\u2192) zur Navigation, Pos1 für die Wurzel, „i" für Eingabe-Fokus und „?" für alle Tastenkombinationen.',
		searchTitle: 'Gespräch suchen',
		searchDescription:
			'Drücke Strg+F (oder Cmd+F) um alle Nachrichten zu suchen. Mit Enter zwischen Ergebnissen navigieren.',
		compareBranchesTitle: 'Äste vergleichen',
		compareBranchesDescription:
			'Verwende das Vergleichs-Symbol in der Knoten-Werkzeugleiste um verschiedene Antwortpfade nebeneinander zu vergleichen.',
		readyTitle: 'Du bist bereit!',
		readyDescription:
			'Du kannst die Tour jederzeit aus den Einstellungen neu starten. Viel Spaß beim Erkunden!',
		skip: 'Überspringen',
		skipAriaLabel: 'Tour überspringen',
		back: 'Zurück',
		next: 'Weiter',
		letsGo: "Los geht's!",
		tourProgress: 'Tour-Fortschritt'
	},
	breadcrumb: {
		showFullPath: 'Vollständigen Pfad anzeigen',
		defaultNodeText: 'Nachricht'
	},
	loading: {
		preparingCanvas: 'Tr\u00E6k-Leinwand wird vorbereitet\u2026'
	},
	toolbar: {
		nodeActions: 'Knotenaktionen'
	},
	replay: {
		stepBack: 'Schritt zurück',
		pause: 'Pause',
		play: 'Abspielen',
		stepForward: 'Schritt vor'
	}
};
