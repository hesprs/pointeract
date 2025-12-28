import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	cleanUrls: true,
	lastUpdated: true,
	title: 'Pointeract',
	description: 'Modern, lightweight, robust and extensible user interaction resolver.',
	rewrites: { 'en/:rest*': ':rest*' },
	locales: {
		root: { label: 'English', lang: 'en' },
	},
	head: [
		['link', { rel: 'icon', href: '/logoFlat.svg' }],
		['meta', { name: 'color-scheme', content: 'dark light' }],
		['meta', { name: 'keywords', content: 'user interaction,pan zoom,multitouch,custom modules,modern lightweight' }],
	],
	sitemap: { hostname: 'https://pointeract.consensia.cc' },
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Documentation', link: '/get-started' },
		],
		logo: { src: '/logoFlat.svg', alt: 'Pointeract logo' },

		sidebar: [
			{
				text: 'Introduction',
				items: [
					{ text: "What's Pointeract?", link: '/whats-pointeract' },
					{ text: 'Get Started', link: '/get-started' },
					{ text: 'Playground', link: '/playground' },
				],
			},
			{
				text: 'Basic',
				link: '/basic',
				items: [
					{ text: 'Lifecycle', link: '/basic/lifecycle' },
					{ text: 'Module Lifecycle', link: '/basic/module-lifecycle' },
					{ text: 'Options', link: '/basic/options' },
					{ text: 'Subscribe/Unsubscribe', link: '/basic/subscribe-unsubscribe' },
				],
			},
			{
				text: 'Modules',
				link: '/modules',
				items: [
					{ text: 'Prevent Default', link: '/modules/prevent-default' },
					{ text: 'Click', link: '/modules/click' },
					{ text: 'Drag', link: '/modules/drag' },
					{ text: 'Wheel Pan Zoom', link: '/modules/wheel-pan-zoom' },
					{ text: 'Multitouch Pan Zoom', link: '/modules/multitouch-pan-zoom' },
				],
			},
			{
				text: 'Events',
				link: '/events',
				items: [
					{ text: 'Pan', link: '/events/pan' },
					{ text: 'True Click', link: '/events/true-click' },
					{ text: 'Drag', link: '/events/drag' },
					{ text: 'Zoom', link: '/events/zoom' },
				],
			},
			{
				text: 'Development',
				items: [
					{ text: 'Custom Modules', link: '/development/custom-modules' },
					{ text: 'Custom Events', link: '/development/custom-events' },
					{ text: 'Custom Options', link: '/development/custom-options' },
					{ text: 'Modifier', link: '/development/modifier' },
					{ text: 'Testing', link: '/development/testing' },
				],
			},
		],

		search: { provider: 'local' },
		socialLinks: [{ icon: 'github', link: 'https://github.com/hesprs/pointeract' }],
		editLink: { pattern: 'https://github.com/hesprs/pointeract/edit/main/docs/:path' },
	},
	markdown: {
		config(md) {
			md.use(groupIconMdPlugin);
		},
		image: { lazyLoading: true },
	},
	vite: {
		plugins: [groupIconVitePlugin()],
		resolve: {
			alias: {
				'@': resolve(__dirname, '..', '..', 'src/'),
			},
		},
	},
});
