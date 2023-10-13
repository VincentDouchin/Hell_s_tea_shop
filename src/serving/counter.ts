import { Vector2 } from 'three'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'
import { Slot, slotEntity } from '@/kitchen/pickup'

const servingCounterQuery = ecs.with('servingCounter')
export const spawnServingCounter = () => {
	if (servingCounterQuery.size) {
		for (const counter of servingCounterQuery) {
			ecs.addComponent(counter, 'position', new Vector2())
		}
	} else {
		const counter = ecs.add({
			sprite: new Sprite(assets.sprites.Cafe),
			position: new Vector2(),
			servingCounter: true,
		})
		const tray = ecs.add({
			parent: counter,
			sprite: new Sprite(assets.sprites.tray).setRenderOrder(0),
			position: new Vector2(-50, -90),
		})
		ecs.add({
			parent: tray,
			...slotEntity(new Sprite(assets.sprites.CupEmpty), new Vector2(), Slot.Cup, false),
		})
	}
}
export const removeServinCounter = () => {
	for (const counter of servingCounterQuery) {
		ecs.removeComponent(counter, 'position')
	}
}