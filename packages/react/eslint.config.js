import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactCompiler from 'eslint-plugin-react-compiler';

const gitignorePath = path.resolve(import.meta.dirname, '../../.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['**/*.md', 'dist/**']
	},
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	{
		plugins: {
			'react-hooks': reactHooks,
			'react-compiler': reactCompiler
		},
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-compiler/react-compiler': 'warn',
			'no-undef': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
			]
		}
	}
);
