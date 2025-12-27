import BaseModule from '@/baseModule';

export default class PreventDefault extends BaseModule {
	onWheel = (e: WheelEvent) => e.preventDefault();
	#preventDefaultFunction = (e: Event) => e.preventDefault();

	onStart = () => {
		this.monitoringElement.style.touchAction = 'none';
		this.monitoringElement.addEventListener('gesturestart', this.#preventDefaultFunction, {
			passive: false,
		});
		this.monitoringElement.addEventListener('gesturechange', this.#preventDefaultFunction, {
			passive: false,
		});
	};

	onStop = () => {
		this.monitoringElement.style.touchAction = '';
		this.monitoringElement.removeEventListener('gesturestart', this.#preventDefaultFunction);
		this.monitoringElement.removeEventListener('gesturechange', this.#preventDefaultFunction);
	};

	dispose = this.onStop;
}
