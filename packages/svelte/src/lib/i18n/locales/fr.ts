import type { TraekTranslations } from '../types';

/** French (Français) translations for the Traek library. */
export const fr: TraekTranslations = {
	canvas: {
		viewportAriaLabel: 'Arbre de conversation',
		emptyStateTitle: 'Démarrer une conversation',
		emptyStateSubtitle: 'Tapez un message ci-dessous pour commencer',
		regenerateResponse: 'Régénérer la réponse',
		branchCelebration: 'Vous avez créé une branche\u00a0! Explorez différentes directions.',
		nodesDeleted: (count: number) =>
			`${count} n\u0153ud${count > 1 ? 's' : ''} supprim\u00e9${count > 1 ? 's' : ''}`,
		gestureHintDrag: 'Glisser pour déplacer',
		gestureHintZoom: 'Défiler pour zoomer'
	},
	input: {
		placeholder: 'Posez une question\u00a0...',
		sendAriaLabel: 'Envoyer le message',
		branchingFromSelected: 'Branche depuis le message sélectionné',
		replyingToSelected: 'Répondre au message sélectionné',
		startingNewConversation: 'Démarrer une nouvelle conversation'
	},
	zoom: {
		zoomIn: 'Zoom avant',
		zoomOut: 'Zoom arrière',
		resetZoom: 'Réinitialiser le zoom à 100\u00a0%',
		fitAllNodes: 'Ajuster tous les n\u0153uds',
		snapToGrid: "Activer l'alignement sur la grille",
		snapToGridEnabled: 'Grille\u00a0: activée',
		snapToGridDisabled: 'Grille\u00a0: désactivée'
	},
	search: {
		placeholder: 'Rechercher\u00a0...',
		noMatches: 'Aucun résultat',
		previousMatch: 'Résultat précédent (Maj+Entrée)',
		nextMatch: 'Résultat suivant (Entrée)',
		closeSearch: 'Fermer la recherche (Échap)'
	},
	keyboard: {
		title: 'Raccourcis clavier',
		navigationSection: 'Navigation',
		navigateToParent: 'Aller au n\u0153ud parent',
		navigateToFirstChild: 'Aller au premier enfant',
		navigateToPreviousSibling: 'Aller au frère précédent',
		navigateToNextSibling: 'Aller au frère suivant',
		goToRoot: 'Aller au n\u0153ud racine',
		goToDeepestLeaf: 'Aller à la feuille la plus profonde',
		actionsSection: 'Actions',
		activateFocusedNode: 'Activer le n\u0153ud ciblé',
		toggleCollapseExpand: 'Réduire/développer',
		switchFocusToInput: 'Focus saisie / nouveau message',
		deleteFocusedNode: 'Supprimer le n\u0153ud ciblé',
		fitAllNodes: 'Ajuster tous les n\u0153uds',
		showHideHelp: "Afficher/masquer l'aide",
		advancedSection: 'Avancé',
		goToRootChord: 'Aller à la racine (accord)',
		goToDeepestLeafChord: 'Aller à la feuille la plus profonde (accord)',
		jumpToNthChild: 'Sauter au n\u00e8me enfant',
		openFuzzySearch: 'Ouvrir la recherche de n\u0153uds',
		openCommandPalette: 'Ouvrir la palette de commandes',
		vimModeSection: 'Navigation Vim',
		vimNavigateUp: 'Aller au parent',
		vimNavigateDown: "Aller à l'enfant",
		vimNavigateLeft: 'Frère précédent',
		vimNavigateRight: 'Frère suivant',
		close: 'Fermer'
	},
	fuzzySearch: {
		placeholder: 'Tapez pour rechercher des n\u0153uds\u00a0...',
		ariaLabel: 'Rechercher des n\u0153uds',
		noContent: '[Pas de contenu]',
		noMatchingNodes: 'Aucun n\u0153ud correspondant',
		resultCount: (count: number) => `${count} résultat${count !== 1 ? 's' : ''}`,
		navigate: 'Naviguer',
		select: 'Sélectionner'
	},
	nodeActions: {
		duplicate: 'Dupliquer',
		delete: 'Supprimer',
		onlyThisNode: 'Ce n\u0153ud uniquement',
		withDescendants: (count: number) => `Avec ${count} descendant${count > 1 ? 's' : ''}`,
		retry: 'Réessayer',
		edit: 'Modifier',
		copyBranch: 'Copier la branche',
		compareBranches: 'Comparer les branches',
		branchCopied: 'Branche copiée dans le presse-papiers',
		copyFailed: 'Échec de la copie dans le presse-papiers'
	},
	textNode: {
		save: 'Enregistrer',
		cancel: 'Annuler',
		scrollForMore: 'Défiler pour plus \u2193'
	},
	toast: {
		undo: 'Annuler',
		dismiss: 'Fermer'
	},
	onboarding: {
		welcomeTitle: 'Bienvenue en mode focus',
		welcomeDescription: 'Naviguez dans votre conversation avec des gestes naturels',
		swipeUpTitle: 'Glisser vers le haut',
		swipeUpDescription: 'Aller plus loin dans la chaîne de réponses',
		swipeDownTitle: 'Glisser vers le bas',
		swipeDownDescription: 'Revenir au message précédent',
		swipeSidewaysTitle: 'Glisser sur le côté',
		swipeSidewaysDescription: 'Passer entre les réponses alternatives',
		keyboardTitle: 'Raccourcis clavier',
		keyboardDescription: 'Utilisez ces touches pour naviguer rapidement',
		keyboardNavigation: 'Navigation',
		keyboardToRoot: 'À la racine',
		keyboardInputFocus: 'Focus saisie',
		keyboardClose: 'Fermer',
		skip: 'Passer',
		skipAriaLabel: 'Passer le tutoriel',
		next: 'Suivant',
		letsGo: "C'est parti\u00a0!",
		tutorialProgress: 'Progression du tutoriel'
	},
	mobile: {
		swipeUpHint: 'Glisser vers le haut pour plus',
		swipeDownHint: 'Glisser vers le bas pour revenir',
		swipeLeftHint: 'Branche précédente',
		swipeRightHint: 'Branche suivante'
	},
	tour: {
		welcomeTitle: 'Bienvenue sur Tr\u00E6k',
		welcomeDescription:
			'Tr\u00E6k est une interface de conversation spatiale. Déplacez-vous librement sur le canevas et explorez les conversations ramifiées.',
		panZoomTitle: 'Naviguer sur le canevas',
		panZoomDescription:
			'Glissez pour déplacer, défilez pour zoomer (ou pincez sur un pavé tactile). Utilisez Ctrl+Défilement pour zoomer précisément. La minimap dans le coin indique votre position.',
		sendMessageTitle: 'Envoyer un message',
		sendMessageDescription:
			"Tapez votre message ici et appuyez sur Entrée pour l'envoyer. Votre conversation sera affichée sous forme d'arbre sur le canevas.",
		createBranchTitle: 'Créer une branche',
		createBranchDescription:
			'Cliquez sur un message et envoyez une nouvelle réponse. Vous pouvez créer plusieurs réponses alternatives à partir du même point.',
		keyboardNavTitle: 'Navigation au clavier',
		keyboardNavDescription:
			'Utilisez les touches fléchées (\u2191\u2193\u2190\u2192) pour naviguer, Origine pour la racine, «\u00a0i\u00a0» pour le focus saisie et «\u00a0?\u00a0» pour tous les raccourcis.',
		searchTitle: 'Rechercher dans la conversation',
		searchDescription:
			'Appuyez sur Ctrl+F (ou Cmd+F) pour rechercher dans tous les messages. Naviguez entre les résultats avec Entrée.',
		compareBranchesTitle: 'Comparer les branches',
		compareBranchesDescription:
			'Utilisez l\u2019icône Comparer dans la barre d\u2019outils du n\u0153ud pour comparer différents chemins de réponse côte à côte.',
		readyTitle: 'Vous êtes prêt\u00a0!',
		readyDescription:
			'Vous pouvez relancer la visite à tout moment depuis les paramètres. Bonne exploration\u00a0!',
		skip: 'Passer',
		skipAriaLabel: 'Passer la visite',
		back: 'Retour',
		next: 'Suivant',
		letsGo: "C'est parti\u00a0!",
		tourProgress: 'Progression de la visite'
	},
	breadcrumb: {
		showFullPath: 'Afficher le chemin complet',
		defaultNodeText: 'Message'
	},
	loading: {
		preparingCanvas: 'Préparation du canevas tr\u00E6k\u2026'
	},
	toolbar: {
		nodeActions: 'Actions sur le n\u0153ud'
	},
	replay: {
		stepBack: 'Étape précédente',
		pause: 'Pause',
		play: 'Lecture',
		stepForward: 'Étape suivante'
	}
};
