/// <reference types="vitest/config" />

import { resolve } from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

export default defineConfig({
	root: 'test',
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/'),
		},
	},
	build: {
		outDir: resolve(__dirname, 'dist'),
		emptyOutDir: true,
		minify: 'terser',
		sourcemap: true,
		lib: {
			entry: {
				index: resolve(__dirname, 'src'),
			},
			name: 'Pointeract',
			formats: ['es', 'cjs'],
			fileName: format => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
		},
	},
	test: {
		browser: {
			enabled: true,
			provider: playwright(),
			// https://vitest.dev/config/browser/playwright
			instances: [{ browser: 'chromium' }],
			headless: true,
		},
	},
});
