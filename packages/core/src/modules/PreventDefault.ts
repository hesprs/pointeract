import BaseModule from '@/BaseModule';

export default class PreventDefault extends BaseModule {
	onWheel = preventDefaultFunction;
	onStart = () => {
		this.element.style.touchAction = 'none';
		this.element.addEventListener('gesturestart', preventDefaultFunction, {
			passive: false,
		});
		this.element.addEventListener('gesturechange', preventDefaultFunction, {
			passive: false,
		});
	};
	onStop = () => {
		this.element.style.touchAction = '';
		this.element.removeEventListener('gesturestart', preventDefaultFunction);
		this.element.removeEventListener('gesturechange', preventDefaultFunction);
	};

	dispose = this.onStop;
}

const preventDefaultFunction = (e: WheelEvent | Event) => e.preventDefault();
