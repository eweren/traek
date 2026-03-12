import { expect, test } from '@playwright/test';
import { gotoExplore } from './helpers';

test.describe('Node creation & streaming', () => {
	test('typing and submitting a message creates a user node', async ({ page }) => {
		await gotoExplore(page);

		const textarea = page.locator('textarea[aria-label]').first();
		await textarea.fill('hello');
		await textarea.press('Enter');

		// The user message should appear as a new node
		await expect(page.getByText('hello').first()).toBeVisible({ timeout: 10_000 });
	});

	test('assistant responds after user message', async ({ page }) => {
		await gotoExplore(page);

		const textarea = page.locator('textarea[aria-label]').first();
		await textarea.fill('hello');
		await textarea.press('Enter');

		// Wait for textarea to clear — confirms submission was accepted
		await expect(textarea).toHaveValue('', { timeout: 5_000 });
		// Fit all nodes into view so the response node is rendered (not a placeholder)
		await page
			.getByRole('button', { name: 'Fit all nodes' })
			.evaluate((el) => (el as HTMLButtonElement).click());

		// The explore engine produces scripted responses — wait for assistant content
		// "Welcome to the træk interactive demo" is the scripted hello response
		await expect(page.getByText(/Welcome to the/i).first()).toBeVisible({ timeout: 15_000 });
	});

	test('user node is cleared from input after submission', async ({ page }) => {
		await gotoExplore(page);

		const textarea = page.locator('textarea[aria-label]').first();
		await textarea.fill('hello');
		await textarea.press('Enter');

		// Input should be cleared after submission
		await expect(textarea).toHaveValue('', { timeout: 5_000 });
	});

	test('multiple messages create a conversation chain', async ({ page }) => {
		await gotoExplore(page);

		const textarea = page.locator('textarea[aria-label]').first();

		const fitAll = () =>
			page
				.getByRole('button', { name: 'Fit all nodes' })
				.evaluate((el) => (el as HTMLButtonElement).click());

		// First message
		await textarea.fill('hello');
		await textarea.press('Enter');
		await expect(textarea).toHaveValue('', { timeout: 5_000 });
		await fitAll();
		await expect(page.getByText(/Welcome to the/i).first()).toBeVisible({ timeout: 15_000 });

		// Second message — "branch" (word boundary) triggers the scripted branching response
		await textarea.fill('branch');
		await textarea.press('Enter');
		await expect(textarea).toHaveValue('', { timeout: 5_000 });
		await fitAll();
		await expect(page.getByText(/Branching is the core idea/i).first()).toBeVisible({
			timeout: 15_000
		});
	});

	test('send button submits the message', async ({ page }) => {
		await gotoExplore(page);

		const textarea = page.locator('textarea[aria-label]').first();
		await textarea.fill('spatial');

		// Use evaluate to bypass annotation toolbar overlay that intercepts clicks
		await page
			.getByRole('button', { name: 'Send message' })
			.evaluate((el) => (el as HTMLButtonElement).click());

		// Wait for textarea to clear — confirms submission was accepted
		await expect(textarea).toHaveValue('', { timeout: 5_000 });
		await page
			.getByRole('button', { name: 'Fit all nodes' })
			.evaluate((el) => (el as HTMLButtonElement).click());

		await expect(page.getByText(/Why spatial layout/i).first()).toBeVisible({ timeout: 15_000 });
	});

	test('Shift+Enter inserts newline instead of submitting', async ({ page }) => {
		await gotoExplore(page);

		const textarea = page.locator('textarea[aria-label]').first();
		await textarea.fill('line one');
		await textarea.press('Shift+Enter');
		await textarea.type('line two');

		// Should NOT have submitted — textarea still has value
		const value = await textarea.inputValue();
		expect(value).toContain('line one');
		expect(value).toContain('line two');
	});
});
