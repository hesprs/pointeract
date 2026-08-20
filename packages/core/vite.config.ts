// oxlint-disable import/no-nodejs-modules
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function p(path: string) {
	return resolve(import.meta.dirname, '..', path);
}

export default defineConfig({
	resolve: { alias: { '@': p('src/') } },
	root: 'tests/dev',
});
