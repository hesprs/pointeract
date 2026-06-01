/// <reference types="vitest/config" />

import createP from '@repo/shared';
import { defineConfig } from 'vite';

const p = createP(import.meta.url);

export default defineConfig({
	resolve: { alias: { '@': p('src/') } },
	root: 'tests/dev',
	test: {
		coverage: {
			include: ['src/**/*.ts'],
		},
		environment: 'happy-dom',
		root: p('.'),
		setupFiles: ['./tests/test-utils.ts'],
	},
});
