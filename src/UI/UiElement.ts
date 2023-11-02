import type { StandardProperties } from 'csstype'
import { Vector2 } from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { toCanvas } from '@/utils/buffer'
import { ecs } from '@/global/init'
import { cssRenderer } from '@/global/rendering'

export type margins = number | { x: number; y: number } | { top: number; bottom: number; right: number; left: number }

const getMargins = (margins: margins) => {
	if (typeof margins === 'number') {
		return { left: margins, right: margins, top: margins, bottom: margins }
	} else if ('x' in margins) {
		return { top: margins.y, bottom: margins.y, left: margins.x, right: margins.x }
	} else {
		return margins
	}
}

export class UIElement extends HTMLDivElement {
	constructor(styles: StandardProperties = {}) {
		super()
		this.setStyles(styles)
	}

	setStyle<K extends keyof StandardProperties>(key: K, value: StandardProperties[K]) {
		(<any> this.style)[key] = value
		return this
	}

	setStyles(styles: StandardProperties) {
		for (const [key, val] of Object.entries(styles) as [keyof StandardProperties, any]) {
			this.style[key] = val
		}
		return this
	}

	withWorldPosition(x = 0, y = 0) {
		return { uiElement: this, cssObject: new CSS2DObject(this), position: new Vector2(x, y) }
	}

	setImage(image: HTMLCanvasElement | OffscreenCanvas, size?: number | string) {
		this.setStyles({
			imageRendering: 'pixelated',
			backgroundSize: 'cover',
		})
		const canvas = image instanceof OffscreenCanvas ? toCanvas(image) : image
		this.setStyle('backgroundImage', `url(${canvas.toDataURL()})`)
		if (size) {
			let finalWidth = `${image.width}px`
			let finalHeight = `${image.height}px`
			if (typeof size === 'number') {
				finalWidth = `${image.width * size}px`
				finalHeight = `${image.height * size}px`
			} else if (typeof size === 'string') {
				finalWidth = size
				finalHeight = size
			}
			this.setStyles({
				width: finalWidth,
				height: finalHeight,
			})
		}
		return this
	}

	text(text: string, size = 1) {
		this.setStyles({ pointerEvents: 'none', fontSize: `${size}em` })
		this.textContent = text
		return this
	}

	ninceSlice(image: HTMLCanvasElement, margin: margins, scale = 1) {
		const margins = getMargins(margin)
		const allMargins = [margins.top, margins.right, margins.left, margins.bottom]
		this.setStyles({
			borderImage: `url(${image.toDataURL()}) round`,
			borderImageSlice: `${allMargins.join(' ')} fill`,
			borderImageRepeat: 'round',
			imageRendering: 'pixelated',
			borderWidth: allMargins.map(border => `${border * scale}px`).join(' '),
			borderStyle: 'solid',
		})
		return this
	}

	static text(text: string, size = 1) {
		return new UIElement().text(text, size)
	}
}
customElements.define('ui-element', UIElement, { extends: 'div' })

const uiElementQuery = ecs.with('uiElement')

export const addUiElements = () => uiElementQuery.onEntityAdded.subscribe((entity) => {
	if (entity.parent?.uiElement) {
		entity.parent.uiElement.appendChild(entity.uiElement)
	} else {
		cssRenderer.domElement.appendChild(entity.uiElement)
	}
})
export const removeUiElements = () => uiElementQuery.onEntityRemoved.subscribe(({ uiElement }) => {
	uiElement.remove()
})
export enum UiTag {
	SwitchButton,
}
export const UiTagQuery = (tag: UiTag) => ecs.with('uiTag').where(({ uiTag }) => uiTag === tag)