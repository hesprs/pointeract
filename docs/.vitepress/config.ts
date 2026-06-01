import createP from '@repo/shared';
import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { ThemeConfig } from 'vitepress-theme-trito';

const inDev = process.env.MODE === 'dev';
const p = createP(import.meta.url);

export default defineConfig<ThemeConfig>({
	cleanUrls: true,
	description: 'Modern, lightweight, robust and extensible user interaction resolver.',
	head: [
		['link', { href: '/favicon.ico', rel: 'icon' }],
		['meta', { content: 'dark light', name: 'color-scheme' }],
		[
			'script',
			{
				'data-website-id': 'f4ddf973-093c-4660-bda7-65a511d5b26c',
				defer: '',
				src: inDev ? '' : 'https://analytics.consensia.cc/script.js',
			},
		],
		[
			'meta',
			{
				content:
					'user interaction,pan zoom,multitouch,custom modules,gestures,javascript,typescript,pointeract',
				name: 'keywords',
			},
		],
	],
	lastUpdated: true,
	locales: {
		root: { label: 'English', lang: 'en' },
	},
	markdown: {
		config(md) {
			md.use(groupIconMdPlugin);
		},
		image: { lazyLoading: true },
	},
	rewrites: { 'en/:rest*': ':rest*' },
	sitemap: { hostname: 'https://pointeract.consensia.cc' },
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		aside: 'left',
		editLink: 'https://github.com/hesprs/pointeract/edit/main/docs/:path',
		footer: {
			copyright: 'Copyright © 2025-2026 Hēsperus',
			message:
				'Licensed under <a href="https://www.apache.org/licenses/LICENSE-2.0.html">Apache License 2.0</a>.',
		},
		logo: { alt: 'Pointeract logo', src: '/logo-small.svg' },
		logoLarge: { alt: 'Pointeract logo', src: '/logo.svg' },

		nav: [
			{ link: '/', text: 'Home' },
			{ activeMatch: '/.+', link: '/get-started', text: 'Documentation' },
		],
		outline: 'deep',
		search: { provider: 'local' },
		sidebar: [
			{
				items: [
					{ link: '/whats-pointeract', text: "What's Pointeract?" },
					{ link: '/playground', text: 'Playground' },
					{ link: '/get-started', text: 'Get Started' },
				],
				text: 'Introduction',
			},
			{
				items: [
					{ link: '/basic/use-pointeract', text: 'Use Pointeract' },
					{ link: '/basic/types', text: 'Types' },
				],
				text: 'Basic',
			},
			{
				items: [
					{ link: '/modules/prevent-default', text: 'Prevent Default' },
					{ link: '/modules/click', text: 'Click' },
					{ link: '/modules/drag', text: 'Drag' },
					{ link: '/modules/swipe', text: 'Swipe' },
					{ link: '/modules/wheel-pan-zoom', text: 'Wheel Pan Zoom' },
					{ link: '/modules/multitouch-pan-zoom', text: 'Multitouch Pan Zoom' },
					{ link: '/modules/lubricator', text: 'Lubricator' },
				],
				link: '/modules',
				text: 'Modules',
			},
			{
				items: [
					{ link: '/events/pan', text: 'Pan' },
					{ link: '/events/true-click', text: 'True Click' },
					{ link: '/events/drag', text: 'Drag' },
					{ link: '/events/swipe', text: 'Swipe' },
					{ link: '/events/zoom', text: 'Zoom' },
				],
				link: '/events',
				text: 'Events',
			},
			{
				collapsed: true,
				items: [
					{ link: '/development/custom-modules', text: 'Custom Modules' },
					{ link: '/development/testing', text: 'Testing' },
				],
				text: 'Development',
			},
		],
		socialLinks: [
			{ icon: 'npm', link: 'https://www.npmjs.com/package/pointeract' },
			{ icon: 'github', link: 'https://github.com/hesprs/pointeract' },
		],
	},
	title: 'Pointeract',
	vite: {
		plugins: [groupIconVitePlugin() as never], // Legacy plugin cannot adapt vite 8
		publicDir: p('../public'),
		ssr: {
			noExternal: ['vitepress-theme-trito'],
		},
	},
});
