<script lang="ts">
	import TourStep from './TourStep.svelte';
	import { getTraekI18n } from '../i18n/index';

	const t = getTraekI18n();

	let { onComplete }: { onComplete: () => void } = $props();

	let currentStep = $state(0);

	// 5 focused steps — covers the minimum viable understanding without overwhelming new users.
	// Advanced features (search, compare, keyboard shortcuts) are disclosed progressively
	// via separate mechanisms (search hint toast, branch celebration, KeyboardDiscoveryHint).
	const steps = $derived([
		{
			title: t.tour.welcomeTitle,
			description: t.tour.welcomeDescription,
			targetSelector: '.viewport',
			position: 'center' as const
		},
		{
			title: t.tour.panZoomTitle,
			description: t.tour.panZoomDescription,
			targetSelector: '.viewport',
			position: 'center' as const
		},
		{
			title: t.tour.sendMessageTitle,
			description: t.tour.sendMessageDescription,
			targetSelector: '.floating-input-container, .input-form',
			position: 'top' as const
		},
		{
			title: t.tour.createBranchTitle,
			description: t.tour.createBranchDescription,
			targetSelector: '.viewport',
			position: 'center' as const
		},
		{
			title: t.tour.readyTitle,
			description: t.tour.readyDescription,
			targetSelector: '.viewport',
			position: 'center' as const
		}
	]);

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			complete();
		}
	}

	function previousStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	function complete() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('traek-desktop-tour-completed', 'true');
		}
		onComplete();
	}
</script>

<TourStep
	title={steps[currentStep].title}
	description={steps[currentStep].description}
	{currentStep}
	totalSteps={steps.length}
	targetSelector={steps[currentStep].targetSelector}
	position={steps[currentStep].position}
	onNext={nextStep}
	onPrevious={previousStep}
	onSkip={complete}
/>
