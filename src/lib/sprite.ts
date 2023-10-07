import { Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three'
import type { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { PixelTexture } from './pixelTexture'
import { ShaderComposer } from './shader'
import { getOffscreenBuffer } from '@/utils/buffer'
import { renderer } from '@/global/rendering'

export class Sprite extends Mesh<PlaneGeometry, MeshBasicMaterial> {
	composer: ShaderComposer
	width: number
	height: number
	#scale = new Vector2(1, 1)
	constructor(texture: PixelTexture) {
		const composer = new ShaderComposer(renderer, texture)
		const geometry = new PlaneGeometry(texture.image.width, texture.image.height)
		composer.render()
		const material = new MeshBasicMaterial({ map: composer.texture, transparent: true })
		super(geometry, material)
		this.width = texture.image.width
		this.height = texture.image.height
		this.composer = composer
	}

	setScale(x: number, y?: number) {
		this.#scale.x = x
		this.#scale.y = y || x
		this.geometry.scale(this.#scale.x, this.#scale.y, 1)
		return this
	}

	setOpacity(opacity: number) {
		this.material.opacity = opacity
		return this
	}

	anchor(anchorX = 0, anchorY = 0) {
		this.position.x = anchorX * this.scaledDimensions.x
		this.position.y = anchorY * this.scaledDimensions.y
		return this
	}

	get scaledDimensions() {
		return new Vector2(this.width, this.height).multiply(this.#scale)
	}

	addPass(shaderPass: ShaderPass) {
		this.composer.addPass(shaderPass)
	}

	set flip(flipped: boolean) {
		this.composer.texture.repeat.x = flipped ? -1 : 1
	}

	get flip() {
		return this.composer.texture.repeat.x === -1
	}

	setSize(width: number, height: number) {
		this.geometry = new PlaneGeometry(width, height)
		return this
	}

	setRenderOrder(nb: number) {
		this.renderOrder = nb
		return this
	}

	static fromBuffer(buffer: OffscreenCanvasRenderingContext2D) {
		return new Sprite(new PixelTexture(buffer.canvas))
	}

	static blank(width: number, height: number) {
		return Sprite.fromBuffer(getOffscreenBuffer(width, height))
	}
}
export type directionX = 'left' | 'right'
export type directionY = 'up' | 'down'
export interface TextureAltasStates<K extends string > {
	speed: { default: number } & Record<string, number>
	states: { [k in (K | `${K}-${directionX}-${directionY}`)]?: PixelTexture[] }
}
