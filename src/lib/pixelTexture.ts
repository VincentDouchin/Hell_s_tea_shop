import { ClampToEdgeWrapping, Texture } from 'three'

export class PixelTexture extends Texture {
	constructor(image: HTMLImageElement | HTMLCanvasElement | OffscreenCanvas) {
		super(image)
		this.needsUpdate = true
		this.wrapS = ClampToEdgeWrapping
		this.wrapT = ClampToEdgeWrapping
	}
}
