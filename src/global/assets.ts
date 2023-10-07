import { AssetLoader, getFileName, loadImage } from '@/lib/assetloader'
import { asyncMapValues, mapKeys } from '@/utils/mapFunctions'

const spriteLoader = new AssetLoader()
	.pipe(async (glob) => {
		const images = await asyncMapValues(glob, m => loadImage(m.default))
		return mapKeys(images, getFileName)
	})
export const loadAssets = async () => {
	return {
		sprites: await spriteLoader.loadRecord(import.meta.glob('@assets/sprites/*.png', { eager: true })),
	}
}
