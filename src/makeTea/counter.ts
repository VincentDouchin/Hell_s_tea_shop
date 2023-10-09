import { Box2, Vector2 } from 'three'
import { kettle } from './kettle'
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
		teaBox: true,
	})
	ecs.add({
		sprite: new Sprite(assets.sprites.CupEmpty),
		position: new Vector2(0, -95),
		parent: counter,
		interactable: new Interactable(),
		cup: { touchedByInfuser: 0 },
	})
	kettle(counter)
}
