// https://vitepress.dev/guide/custom-theme

import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import './style.css';
import 'virtual:group-icons.css';
import Layout from './layout.vue';

export default {
	extends: DefaultTheme,
	Layout: Layout,
	enhanceApp({ app, router, siteData }) {
		// ...
	},
} satisfies Theme;
