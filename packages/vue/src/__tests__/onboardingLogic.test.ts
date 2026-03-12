import { describe, it, expect } from 'vitest';
import {
	getNextStepIndex,
	getStepButtonText,
	isValidStepIndex,
	ONBOARDING_STEPS
} from '../mobile/onboardingLogic.js';

describe('getNextStepIndex', () => {
	it('returns next step index when not last step', () => {
		expect(getNextStepIndex(0)).toBe(1);
		expect(getNextStepIndex(1)).toBe(2);
	});

	it('returns null at the last step', () => {
		expect(getNextStepIndex(ONBOARDING_STEPS.length - 1)).toBeNull();
	});
});

describe('getStepButtonText', () => {
	it('returns Next for intermediate steps', () => {
		expect(getStepButtonText(0)).toBe('Next');
	});

	it("returns Let's go! for the last step", () => {
		expect(getStepButtonText(ONBOARDING_STEPS.length - 1)).toBe("Let's go!");
	});
});

describe('isValidStepIndex', () => {
	it('returns true for valid indices', () => {
		expect(isValidStepIndex(0)).toBe(true);
		expect(isValidStepIndex(ONBOARDING_STEPS.length - 1)).toBe(true);
	});

	it('returns false for out-of-bounds indices', () => {
		expect(isValidStepIndex(-1)).toBe(false);
		expect(isValidStepIndex(ONBOARDING_STEPS.length)).toBe(false);
	});
});
