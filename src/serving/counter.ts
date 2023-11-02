import { Vector2 } from 'three'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Slot, slotEntity } from '@/kitchen/pickup'
import { Sprite } from '@/lib/sprite'

const servingCounterQuery = ecs.with('servingCounter')
export const spawnServingCounter = () => {
	if (!servingCounterQuery.size) {
		// ! Counter
		const counter = ecs.add({
			renderOrder: 1,
			sprite: new Sprite(assets.sprites.Cafe),
			position: new Vector2(),
			servingCounter: true,
		})
		// ! Tray
		const tray = ecs.add({
			parent: counter,
			renderOrder: 1,
			sprite: new Sprite(assets.sprites.tray).setRenderOrder(0),
			position: new Vector2(-50, -90),
			tray: true,
		})
		// ! Bell
		ecs.add({
			renderOrder: 1,
			parent: counter,
			sprite: new Sprite(assets.sprites.bell),
			position: new Vector2(0, -80),
			bell: true,
			interactable: new Interactable(),
			showInteractable: true,
		})
		// ! Cup Slot
		ecs.add({
			parent: tray,
			renderOrder: 1,
			...slotEntity(new Sprite(assets.sprites.CupEmpty), new Vector2(), Slot.Cup, false),
		})
	}
}
