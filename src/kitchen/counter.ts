import { Vector2 } from 'three'
import { kettle } from './kettle'
import { CameraBounds } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'

export const spawnCounter = () => {
	const counter = ecs.add({
		counter: true,
		sprite: new Sprite(assets.sprites.Cafe),
		anchor: { bottom: true },
		cameraBounds: new CameraBounds(),
		position: new Vector2(),
	})
	ecs.add({
		sprite: new Sprite(assets.sprites.TeaBoxOver),
		position: new Vector2(150, -95),
		parent: counter,
		interactable: new Interactable(),
		showInteractable: true,
		teaBox: true,
	})
	ecs.add({
		sprite: new Sprite(assets.sprites.CupEmpty),
		position: new Vector2(0, -95),
		parent: counter,
		interactable: new Interactable(),
		showInteractable: true,
		cup: { touchedByInfuser: 0 },
	})
	kettle(counter)
}
