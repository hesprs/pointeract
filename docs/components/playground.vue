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
import { onMounted, reactive, useTemplateRef } from 'vue';
import { Click, Drag, MultitouchPanZoom, Pointeract, PreventDefault, WheelPanZoom } from '@';

const square = useTemplateRef('square');
const data = reactive({
	x: 0,
	y: 0,
	scale: 1,
	streak: 0,
});
let streakTimeout: undefined | NodeJS.Timeout;
onMounted(() => {
	const pointeract = new Pointeract(square.value as HTMLElement, [
		PreventDefault,
		WheelPanZoom,
		MultitouchPanZoom,
		Click,
		Drag,
	]).start();
	pointeract.on('pan', e => {
		data.x += e.detail.x;
		data.y += e.detail.y;
	});
	pointeract.on('drag', e => {
		data.x += e.detail.x;
		data.y += e.detail.y;
	});
	pointeract.on('zoom', e => {
		const detail = e.detail;
		data.scale *= detail.factor;
		data.x += detail.x * (1 - detail.factor);
		data.y += detail.y * (1 - detail.factor);
	});
	pointeract.on('trueClick', e => {
		data.streak = e.detail.streak;
		if (streakTimeout) clearTimeout(streakTimeout);
		streakTimeout = setTimeout(() => {
			data.streak = 0;
		}, pointeract.options.clickPreserveTime);
	});
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
	background-color: rgb(72, 130, 255);
	border-radius: 16px;
	transform-origin: 0 0;
	box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.3);
	font-size: 100px;
	font-weight: bold;
}
</style>
