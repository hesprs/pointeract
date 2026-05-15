/// <reference types="vitest/config" />

import { createP } from '@repo/shared';
import { defineConfig } from 'vite';

const p = createP(import.meta.url);

export default defineConfig({
	root: 'tests/dev',
	resolve: { alias: { '@': p('src/') } },
	test: {
		root: p('.'),
		environment: 'happy-dom',
		setupFiles: ['./tests/testUtils.ts'],
		coverage: {
			include: ['src/**/*.ts'],
		},
	},
});
