<script setup lang="ts">
import { nextTick, provide, Ref } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const enableTransitions = () => {
	return (
		'startViewTransition' in document &&
		window.matchMedia('(prefers-reduced-motion: no-preference)').matches
	);
};

const setupToggleDark = (isDark: Ref<boolean>) => {
	provide('toggle-appearance', async ({ clientX: x, clientY: y }: PointerEvent) => {
		if (!enableTransitions()) {
			isDark.value = !isDark.value;
			return;
		}

		console.log('toggle-appearance');
		document.documentElement.style.setProperty('--darkX', x + 'px');
		document.documentElement.style.setProperty('--darkY', y + 'px');

		await document.startViewTransition(async () => {
			isDark.value = !isDark.value;
			await nextTick();
		}).ready;
	});
};

const { isDark } = useData();
setupToggleDark(isDark);
</script>

<template>
	<DefaultTheme.Layout />
</template>

<style>
::view-transition-old(*) {
	animation: none;
}

::view-transition-new(*) {
	animation: globalDark 0.5s ease-in;
}

@keyframes globalDark {
	from {
		clip-path: circle(0% at var(--darkX) var(--darkY));
	}

	to {
		clip-path: circle(100% at var(--darkX) var(--darkY));
	}
}
</style>
