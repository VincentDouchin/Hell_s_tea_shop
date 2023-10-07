import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

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
