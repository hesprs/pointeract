<template>
	<div class="container">
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
import { onMounted, reactive, useTemplateRef, onBeforeUnmount } from 'vue';
import {
	Click,
	Drag,
	MultitouchPanZoom,
	Pointeract,
	PreventDefault,
	WheelPanZoom,
	PointeractInterface,
	Lubricator,
	dragPreset,
	zoomPreset,
	panPreset,
} from '@';

const square = useTemplateRef('square');
const data = reactive({
	x: 0,
	y: 0,
	scale: 1,
	streak: 0,
});
let streakTimeout: undefined | NodeJS.Timeout;
let pointeract: PointeractInterface<
	[Click, Drag, MultitouchPanZoom, PreventDefault, WheelPanZoom, Lubricator]
>;

onMounted(() => {
	if (!square.value) return;
	pointeract = new Pointeract(
		{
			element: square.value,
			lubricator: {
				drag: dragPreset,
				pan: panPreset,
				zoom: zoomPreset,
			},
		},
		[PreventDefault, WheelPanZoom, MultitouchPanZoom, Click, Drag, Lubricator],
	).start();
	pointeract.on('pan', (e) => {
		data.x += e.detail.deltaX;
		data.y += e.detail.deltaY;
	});
	pointeract.on('drag', (e) => {
		data.x += e.detail.deltaX;
		data.y += e.detail.deltaY;
	});
	pointeract.on('zoom', (e) => {
		const detail = e.detail;
		data.scale *= detail.factor;
		data.x += detail.x * (1 - detail.factor);
		data.y += detail.y * (1 - detail.factor);
	});
	pointeract.on('trueClick', (e) => {
		data.streak = e.detail.streak;
		if (streakTimeout) clearTimeout(streakTimeout);
		streakTimeout = setTimeout(() => {
			data.streak = 0;
		}, 400);
	});
});

onBeforeUnmount(() => {
	pointeract.dispose();
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
	top: calc(50% - 150px);
	left: calc(50% - 150px);
	width: 300px;
	height: 300px;
	color: white;
	background-color: rgb(72, 130, 255);
	border-radius: 16px;
	transform-origin: 0 0;
	box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.3);
	font-size: 100px;
	font-weight: bold;
}
</style>
