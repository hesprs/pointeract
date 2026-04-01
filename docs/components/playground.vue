<template>
	<div class="container" ref="container">
		<div
			class="test-square"
			ref="square"
			:style="{ transform: `translate(${data.x}px, ${data.y}px) scale(${data.scale})` }"
		>
			{{ data.streak }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	Click,
	Drag,
	MultitouchPanZoom,
	Pointeract,
	PreventDefault,
	WheelPanZoom,
	PointeractInterface,
	Lubricator,
	lubricatorDragPreset as drag,
	lubricatorPanPreset as pan,
	lubricatorZoomPreset as zoom,
} from '@';
import { onMounted, reactive, useTemplateRef, onBeforeUnmount } from 'vue';
import { Coordinates } from '@/types';

function C2C(coords: Coordinates) {
	return {
		x: coords.x - data.x,
		y: coords.y - data.y,
	};
}


const square = useTemplateRef('square');
const container = useTemplateRef('container');
const data = reactive({
	x: 0,
	y: 0,
	scale: 1,
	streak: 0,
});
let streakTimeout: null | NodeJS.Timeout;
let pointeract: PointeractInterface<
	[Click, Drag, MultitouchPanZoom, PreventDefault, WheelPanZoom, Lubricator]
>;


onMounted(() => {
	if (!container.value || !square.value) return;
	const squareRect = square.value.getBoundingClientRect();
	const bodyRect = container.value.getBoundingClientRect();
	data.x = (bodyRect.width - squareRect.width) / 2;
	data.y = (bodyRect.height - squareRect.height) / 2;
	pointeract = new Pointeract(
		{
			element: container.value,
			lubricator: { drag, pan, zoom },
		},
		[PreventDefault, WheelPanZoom, MultitouchPanZoom, Click, Drag, Lubricator],
	)
		.on('pan', (e) => {
			data.x += e.deltaX;
			data.y += e.deltaY;
		})
		.on('drag', (e) => {
			data.x += e.deltaX;
			data.y += e.deltaY;
		})
		.on('zoom', (e) => {
			data.scale *= e.factor;
			const canvas = C2C(e);
			data.x = e.x - canvas.x * e.factor;
			data.y = e.y - canvas.y * e.factor;
		})
		.on('trueClick', (e) => {
			data.streak = e.streak;
			if (streakTimeout) clearTimeout(streakTimeout);
			streakTimeout = setTimeout(() => {
				data.streak = 0;
			}, 400);
		})
		.start();
});


onBeforeUnmount(() => {
	pointeract.dispose();
	if (streakTimeout) {
		clearTimeout(streakTimeout);
		streakTimeout = null;
	}
});
</script>

<style scoped>
.container {
	width: 100%;
	height: 500px;
	display: block;
	position: relative;
	overflow: hidden;
	border-radius: 12px;
	box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.15);
	border: 1px solid rgba(134, 134, 134, 0.4);
	user-select: none;
}
.test-square {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 300px;
	height: 300px;
	color: white;
	background-color: rgb(72, 130, 255);
	border-radius: 16px;
	transform-origin: top left;
	box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.3);
	font-size: 100px;
	font-weight: bold;
}
</style>
