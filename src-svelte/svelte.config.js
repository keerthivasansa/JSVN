import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { resolve } from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter({
			assets: "../public", 
			pages: "../public",
			precompress: true,
		}), 
		vite: {
			resolve: {
				alias: {
					"$src": resolve("./src")
				}
			}
		}
	}
};

export default config;
