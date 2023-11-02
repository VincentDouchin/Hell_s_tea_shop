import { exec } from 'node:child_process'
import { readdir, writeFile } from 'node:fs/promises'

import path from 'node:path'
import process from 'node:process'
import type { PluginOption } from 'vite'

export const getFileName = (path: string) => {
	return	path.split(/[./]/g).at(-2) ?? ''
}
export const getFolderName = (path: string) => {
	return	path.split(/[./]/g).at(-3) ?? ''
}
export const getAnimationName = (path: string) => {
	let parts = getFileName(path).split(/(?=[A-Z])/).map(s => s.toLowerCase())
	parts.shift()
	const fromCreatures = parts.indexOf('creatures')
	if (fromCreatures !== -1) {
		parts = parts.filter((_, i) => i !== fromCreatures && i !== fromCreatures + 1)
	}
	return parts.join('-')
}
export default function watchAssets(): PluginOption {
	const launchScript = async (filePath?: string) => {
		if (!filePath || (filePath.includes('assets\\') && filePath.split('.').at(-1) === 'png')) {
			const folders: Record<string, string[]> = {}
			const assetsDir = await readdir('./assets', { recursive: true, withFileTypes: true })
			for (const dir of assetsDir) {
				if (dir.isDirectory() && dir.name[0] !== '_') {
					const files = (await readdir(`./assets/${dir.name}`))
					const fileNames = files.filter(x => !x.includes('.ase'))
						.map(x => x.split('.')[0])

					folders[dir.name] = fileNames
				}
			}
			let result = ''

			for (const [folder, files] of Object.entries(folders)) {
				result += `type ${folder} = ${files.map(x => `'${x}'`).join(' | ')}\n`
			}

			await writeFile(path.join(process.cwd(), 'assets', 'assets.d.ts'), result)
			exec('eslint assets/assets.d.ts --fix')
			console.log('regenerated asset names')
		}
	}
	launchScript()
	return {
		name: 'watch-assets',
		apply: 'serve',
		configureServer(server) {
			server.watcher.on('add', launchScript)
			server.watcher.on('unlink', launchScript)
		},

	}
}
