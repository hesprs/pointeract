/// <reference types="vitest/config" />

import { resolve } from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
	root: 'tests/dev',
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
			formats: ['es'],
			fileName: `index.js`,
		},
	},
	test: {
		root: __dirname,
		environment: 'happy-dom',
		setupFiles: ['./tests/testUtils.ts'],
		coverage: {
			include: ['src/**/*.ts'],
		},
	},
});
