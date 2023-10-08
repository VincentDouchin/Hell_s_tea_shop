import { World } from 'miniplex'
import type { Box2, Group, Object3D, OrthographicCamera, Vector2 } from 'three'
import { loadAssets } from './assets'
import type { Interactable, PointerInput } from './interactions'
import type { OutlineShader } from '@/shaders/OutlineShader'
import type { Sprite } from '@/lib/sprite'
import type { Liquid } from '@/makeTea/pour'

export interface Entity {
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
	infuserFilled?: true
	object?: Object3D
	tea?: true

}

export type Component = keyof Entity
export const assets = await loadAssets()
export const ecs = new World<Entity>()
ecs.onEntityAdded.subscribe((entity) => {
	if (entity.parent) {
		if (entity.parent.children) {
			entity.parent.children.push(entity)
		} else {
			ecs.addComponent(entity.parent, 'children', [entity])
		}
	}
})
ecs.with('children').onEntityRemoved.subscribe((entity) => {
	for (const children of entity.children) {
		ecs.remove(children)
	}
})
