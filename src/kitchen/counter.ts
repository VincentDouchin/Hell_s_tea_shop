import { Vector2 } from 'three'
import { kettle } from './kettle'
import { Pickable, Slot } from './pickup'
import { CameraBounds } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'

const counterQuery = ecs.with('counter')
export const spawnCounter = () => {
	if (counterQuery.size) {
		for (const entity of counterQuery) {
			ecs.addComponent(entity, 'position', new Vector2())
		}
	} else {
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
			sprite: new Sprite(assets.sprites.CupEmpty).setRenderOrder(2),
			position: new Vector2(0, -95),
			parent: counter,
			interactable: new Interactable(),
			showInteractable: true,
			cup: { touchedByInfuser: 0 },
			pickable: new Pickable(Slot.Cup, assets.ui.CupEmpty),
		})

		kettle(counter)
	}
}
export const removeCounter = () => {
	for (const entity of counterQuery) {
		ecs.removeComponent(entity, 'position')
	}
}