import { Box2, Vector2 } from 'three'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'
import { Interactable } from '@/global/interactions'

export const spawnCounter = () => {
	const counter = ecs.add({
		sprite: new Sprite(assets.sprites.Cafe),
		cameraBounds: new Box2(),
		position: new Vector2(),
	})
	ecs.add({
		sprite: new Sprite(assets.sprites.TeaBoxOver),
		position: new Vector2(150, -95),
		parent: counter,
		interactable: new Interactable(),
	})
	ecs.add({
		sprite: new Sprite(assets.sprites.CupEmpty),
		position: new Vector2(0, -95),
		parent: counter,
		interactable: new Interactable(),
		cup: true,
	})
	ecs.add({
		sprite: new Sprite(assets.sprites.Kettle1),
		position: new Vector2(-200, -70),
		interactable: new Interactable(),
		pickable: true,
		kettle: true,
	})
}
