import { AssetLoader, addMargin, getFileName, loadImage } from '@/lib/assetloader'
import { PixelTexture } from '@/lib/pixelTexture'
import { getOffscreenBuffer, toCanvas } from '@/utils/buffer'
import { asyncMapValues, mapKeys, mapValues } from '@/utils/mapFunctions'

const spriteLoader = new AssetLoader()
	.pipe(async (glob) => {
		const images = await asyncMapValues(glob, async m => new PixelTexture(await loadImage(m.default)))
		return mapKeys(images, getFileName)
	})

const spiceLoader = new AssetLoader()
	.pipe(async (glob) => {
		const images = await asyncMapValues(glob, async m => await loadImage(m.default))
		const withMargins = mapValues(images, addMargin(1))
		return mapKeys(withMargins, getFileName)
	})
const atlasLoader = new AssetLoader()
	.pipe(async (glob) => {
		const images = await asyncMapValues(glob, m => loadImage(m.default))
		const atlas = mapValues(images, (img) => {
			const res = []
			for (let i = 0; i < img.width; i += img.height) {
				const buffer = getOffscreenBuffer(img.height, img.height)
				buffer.drawImage(img, i, 0, img.height, img.height, 0, 0, img.height, img.height)
				res.push(new PixelTexture(buffer.canvas))
			}
			return res
		})
		return mapKeys(atlas, getFileName)
	})
const uiLoader = new AssetLoader()
	.pipe(async (glob) => {
		const images = await asyncMapValues(glob, m => loadImage(m.default))
		const canvas = mapValues(images, toCanvas)
		return mapKeys(canvas, getFileName)
	})
export const loadAssets = async () => {
	return {
		sprites: await spriteLoader.loadRecord<sprites>(import.meta.glob('@assets/sprites/*.png', { eager: true })),
		tea: await spriteLoader.loadRecord<tea>(import.meta.glob('@assets/tea/*.png', { eager: true })),
		spices: await spiceLoader.loadRecord<spices>(import.meta.glob('@assets/spices/*.png', { eager: true })),
		atlas: await atlasLoader.loadRecord<atlas>(import.meta.glob('@assets/atlas/*.png', { eager: true })),
		ui: await uiLoader.loadRecord<ui>(import.meta.glob('@assets/ui/*.png', { eager: true })),
	}
}
