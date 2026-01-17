import { beforeEach, vi } from 'vitest';

beforeEach(() => {
	// Mock getBoundingClientRect globally
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
		function (this: HTMLElement) {
			// Only mock for our test element
			if (this.id === 'test-square') {
				return {
					width: 200,
					height: 200,
					left: 0,
					top: 0,
					right: 200,
					bottom: 200,
					x: 0,
					y: 0,
				} as DOMRect;
			}
			return {
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
				x: 0,
				y: 0,
			} as DOMRect;
		},
	);
});
