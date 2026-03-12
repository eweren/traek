import type { Preview } from '@storybook/sveltekit';
import { applyThemeToRoot } from '../src/lib/theme/ThemeProvider.svelte';
import { themes } from '../src/lib/theme/themes';
import type { ThemeName } from '../src/lib/theme/themes';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo'
		}
	},

	globalTypes: {
		traekTheme: {
			description: 'Traek colour theme',
			defaultValue: 'dark',
			toolbar: {
				title: 'Theme',
				icon: 'paintbrush',
				items: [
					{ value: 'dark', title: 'Dark', right: '🌙' },
					{ value: 'light', title: 'Light', right: '☀️' },
					{ value: 'highContrast', title: 'High Contrast', right: '⬛' }
				],
				dynamicTitle: true
			}
		}
	},

	decorators: [
		(story, context) => {
			const themeName = (context.globals['traekTheme'] ?? 'dark') as ThemeName;
			const theme = themes[themeName];
			if (theme && typeof document !== 'undefined') {
				applyThemeToRoot(theme, themeName);
			}
			return story();
		}
	]
};

export default preview;
