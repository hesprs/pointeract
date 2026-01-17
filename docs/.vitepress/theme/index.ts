// https://vitepress.dev/guide/custom-theme

import './style.css';
import 'virtual:group-icons.css';

import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import Layout from './layout.vue';

export default {
	extends: DefaultTheme,
	Layout: Layout,
} satisfies Theme;
