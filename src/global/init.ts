import { World } from 'miniplex'
import type { Group, OrthographicCamera, Scene, Vector2 } from 'three'
import type { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { loadAssets } from './assets'
import type { CameraBounds } from './camera'
import type { Interactable } from './interactions'
import type { UIElement } from '@/UI/UiElement'
import type { TextureAltas } from '@/lib/atlas'
import type { Sprite } from '@/lib/sprite'
import type { Timer } from '@/lib/time'
import type { Pickable } from '@/makeTea/pickup'
import type { Liquid } from '@/makeTea/pour'
import type { ColorShader } from '@/shaders/ColorShader'
import type { OutlineShader } from '@/shaders/OutlineShader'
import type { PixelTexture } from '@/lib/pixelTexture'

export class Entity {
	scene?: Scene
	sceneBackground?: PixelTexture
	// ! Sprites
	sprite?: Sprite
	animator?: Timer
	atlas?: TextureAltas
	// ! Shaders
	outlineShader?: OutlineShader
	colorShader?: ColorShader
	// ! Camera
	camera?: OrthographicCamera
	position?: Vector2
	cameraBounds?: CameraBounds
	group?: Group
	parent?: Entity
	children?: Entity[]
	interactable?: Interactable
	showInteractable?: boolean
	anchor?: { bottom?: boolean; top?: boolean; left?: boolean; right?: boolean }
	pickable?: Pickable
	picked?: boolean
	kettle?: boolean
	cup?: { touchedByInfuser: number }
	filled?: Liquid
	teaBox?: boolean
	teaBoxOpened?: boolean
	infuser?: boolean
	infuserFilled?: boolean
	tea?: boolean
	// ! Kettle
	kettleButton?: boolean
	kettleTableau?: boolean
	buttonToClick?: boolean
	buttonsToClick?: { amount: number; last: Entity | null }
	temperature?: { temperature: number; timer: Timer }
	temperatureGauge?: boolean
	closeTableau?: boolean
	// ! UI
	cssObject?: CSS2DObject
	uiElement?: UIElement
	tooltip?: boolean
}
type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T]

export type ComponentsOfType<T> = Prettify<KeysOfType<Required<Entity>, T>> & keyof Entity

export type Component = keyof Entity
export const assets = await loadAssets()
export const ecs = new World<Entity>()
export const addChildren = () => {
	return ecs.onEntityAdded.subscribe((entity) => {
		if (entity.parent) {
			if (entity.parent.children) {
				entity.parent.children.push(entity)
			} else {
				ecs.addComponent(entity.parent, 'children', [entity])
			}
		}
	})
}
export const despanwChildren = () => {
	return ecs.with('children').onEntityRemoved.subscribe((entity) => {
		for (const children of entity.children) {
			ecs.remove(children)
		}
	})
}
export const removeParent = (entity: Entity) => {
	if (entity.parent) {
		entity.parent.children = entity.parent.children?.filter(c => c !== entity)
		ecs.removeComponent(entity, 'parent')
	}
}
export const despawnOfType = (c: Component) => {
	const query = ecs.with(c)
	return () => {
		for (const entity of query) {
			ecs.remove(entity)
		}
	}
}
