import { Vector2 } from 'three'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'

export const spawnServingCounter = () => {
	ecs.add({
		sprite: new Sprite(assets.sprites.Cafe),
		position: new Vector2(),
	})
}