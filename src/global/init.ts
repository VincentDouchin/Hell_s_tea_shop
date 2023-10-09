import { World } from 'miniplex'
import type { Box2, Group, Object3D, OrthographicCamera, Vector2 } from 'three'
import { loadAssets } from './assets'
import type { Interactable, PointerInput } from './interactions'
import type { OutlineShader } from '@/shaders/OutlineShader'
import type { Sprite } from '@/lib/sprite'
import type { Liquid } from '@/makeTea/pour'
import type { Timer } from '@/lib/time'
import type { TextureAltas } from '@/lib/atlas'

export class Entity {
	sprite?: Sprite
	camera?: OrthographicCamera
	position?: Vector2
	cameraBounds?: Box2
	group?: Group
	parent?: Entity
	children?: Entity[]
	interactable?: Interactable
	outlineShader?: OutlineShader
	pickable?: boolean
	picked?: { input: PointerInput; initialPosition: Vector2 }
	kettle?: boolean
	cup?: { touchedByInfuser: number }
	filled?: Liquid
	teaBox?: boolean
	teaBoxOpened?: boolean
	infuser?: boolean
	infuserFilled?: boolean
	object?: Object3D
	tea?: boolean
	animator?: Timer
	atlas?: TextureAltas
	kettleButton?: boolean
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
