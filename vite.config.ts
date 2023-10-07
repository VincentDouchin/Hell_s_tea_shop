import path from 'node:path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import watchAssets from './scripts/generateAssetNamesPlugin'

// https://vitejs.dev/config/
export default defineConfig(() => {
	const config: UserConfig = {
		plugins: [watchAssets()],
		base: '',

		build: {
			target: 'esnext',

		},

		resolve: {
			alias: [
				{ find: '@', replacement: path.resolve(__dirname, './src') },
				{ find: '@assets', replacement: path.resolve(__dirname, './assets') },

			],
		},

	}

	return config
})