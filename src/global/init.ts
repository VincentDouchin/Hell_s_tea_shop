import { World } from 'miniplex'
import type { Box2, Group, OrthographicCamera, Vector2 } from 'three'
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
	interactable?: Interactable
	outlineShader?: OutlineShader
	pickable?: boolean
	picked?: PointerInput
	kettle?: boolean
	cup?: boolean
	filled?: Liquid
}

export type Component = keyof Entity
export const assets = await loadAssets()
export const ecs = new World<Entity>()
