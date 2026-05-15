import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function createP(url: string) {
	const dirName = dirname(fileURLToPath(url));
	return (path: string) => resolve(dirName, path);
}
