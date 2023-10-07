import { AssetLoader, getFileName, loadImage } from '@/lib/assetloader'
import { PixelTexture } from '@/lib/pixelTexture'
import { asyncMapValues, mapKeys } from '@/utils/mapFunctions'

const spriteLoader = new AssetLoader()
	.pipe(async (glob) => {
		const images = await asyncMapValues(glob, async m => new PixelTexture(await loadImage(m.default)))
		return mapKeys(images, getFileName)
	})
export const loadAssets = async () => {
	return {
		sprites: await spriteLoader.loadRecord<sprites>(import.meta.glob('@assets/sprites/*.png', { eager: true })),
	}
}
