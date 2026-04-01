/// <reference types="vitest/config" />

import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function p(path: string) {
	return resolve(__dirname, path);
}

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
		root: __dirname,
		environment: 'happy-dom',
		setupFiles: ['./tests/testUtils.ts'],
		coverage: {
			include: ['src/**/*.ts'],
		},
	},
});
