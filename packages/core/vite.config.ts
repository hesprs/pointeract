/// <reference types="vitest/config" />

import { createP } from '@repo/shared';
import { defineConfig } from 'vite';

const p = createP(import.meta.url);

export default defineConfig({
	root: 'tests/dev',
	resolve: {
		alias: {
			'@': p('src/'),
		},
	},
	build: {
		outDir: p('dist'),
		emptyOutDir: true,
		minify: 'terser',
		sourcemap: true,
		lib: {
			entry: {
				index: p('src'),
			},
			name: 'Pointeract',
			formats: ['es'],
			fileName: `index`,
		},
	},
	test: {
		root: p('.'),
		environment: 'happy-dom',
		setupFiles: ['./tests/testUtils.ts'],
		coverage: {
			include: ['src/**/*.ts'],
		},
	},
});
