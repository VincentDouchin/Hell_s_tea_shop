import { World } from 'miniplex'
import { loadAssets } from './assets'
import type { Sprite } from '@/lib/sprite'

export interface Entity {
	sprite: Sprite
}
export const assets = await loadAssets()
export const ecs = new World<Entity>()
