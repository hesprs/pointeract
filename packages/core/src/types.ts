type Indexable = string | number | symbol;
// oxlint-disable-next-line typescript/no-explicit-any
export type General = any;
export type GeneralFunction = (...args: Array<General>) => General;
export type GeneralDictionary = Record<Indexable, General>;

export type Coordinates = {
	x: number;
	y: number;
};

export type Pointers = Map<number, Pointer>;

export type Pointer = {
	records: Array<{ x: number; y: number; timestamp: number }>;
	target: EventTarget | null;
	index: number;
	[key: Indexable]: General;
};

export type StdEvents = {
	pan: { deltaX: number; deltaY: number };
	drag: { deltaX: number; deltaY: number; x: number; y: number };
	swipe: {
		direction: string;
		velocity: number;
		streak: number;
		angle: number;
		duration: number;
		displacement: number;
	};
	trueClick: Coordinates & { target: EventTarget | null; streak: number };
	zoom: Coordinates & { factor: number };
};

export type BaseOptions = {
	coordinateOutput?: 'absolute' | 'relative' | 'relativeFraction';
	element: HTMLElement;
};
