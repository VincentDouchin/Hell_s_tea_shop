import { getScreenBuffer } from '@/utils/buffer'

type pipeFn<T> = (glob: Record<string, T>) => Promise<Record<string, any>> | Record<string, any>

export class AssetLoader< T = { default: string } > {
	#fn: pipeFn<T> = x => x
	constructor() {}
	pipe<F extends pipeFn<T>>(fn: F) {
		this.#fn = fn
		return this as AssetLoader<Awaited<ReturnType<F>>>
	}

	async loadRecord<K extends string>(glob: Record<string, T>) {
		return await this.#fn(glob) as Promise<Record< K, T[keyof T]>>
	}
}

export const loadImage = (path: string): Promise<HTMLImageElement> => new Promise((resolve) => {
	const img = new Image()
	img.src = path
	img.onload = () => resolve(img)
})
export const addMargin = (margin: number) => (img: HTMLImageElement) => {
	const buffer = getScreenBuffer(img.width + 2 * margin, img.height + 2 * margin)
	buffer.drawImage(img, 0, 0, img.width, img.height, margin, margin, img.width, img.height)
	return buffer.canvas
}

export const getFileName = (path: string) => {
	return	path.split(/[./]/g).at(-2) ?? ''
}
export const getFolderName = (path: string) => {
	return	path.split(/[./]/g).at(-3) ?? ''
}
