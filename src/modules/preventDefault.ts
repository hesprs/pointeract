import BaseModule from '@/baseModule';

export default class PreventDefault extends BaseModule {
	onWheel = (e: WheelEvent) => e.preventDefault();
	#preventDefaultFunction = (e: Event) => e.preventDefault();

	onStart = () => {
		this.element.style.touchAction = 'none';
		this.element.addEventListener('gesturestart', this.#preventDefaultFunction, {
			passive: false,
		});
		this.element.addEventListener('gesturechange', this.#preventDefaultFunction, {
			passive: false,
		});
	};

	onStop = () => {
		this.element.style.touchAction = '';
		this.element.removeEventListener('gesturestart', this.#preventDefaultFunction);
		this.element.removeEventListener('gesturechange', this.#preventDefaultFunction);
	};

	dispose = this.onStop;
}
