import { Vector2 } from 'three'
import type { Entity } from '@/global/init'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'
import { TextureAltas } from '@/lib/atlas'
import { State } from '@/lib/state'

export const kettle = (parent: Entity) => {
	const kettle = ecs.add({
		sprite: new Sprite(assets.sprites.Kettle1),
		position: new Vector2(-200, -70),
		interactable: new Interactable(),
		pickable: true,
		kettle: true,
		parent,
	})
	ecs.add({
		parent: kettle,
		atlas: new TextureAltas(assets.atlas.kettleTemperatureGauge),
		position: new Vector2(-6, -23),
	})
	ecs.add({
		parent: kettle,
		sprite: new Sprite(assets.sprites.kettleButton),
		position: new Vector2(10.5, -21.5),
		interactable: new Interactable(),
		kettleButton: true,
	})
}
export const kettleGame = new State()
const kettleButtonQuery = ecs.with('kettleButton', 'interactable')
export const clickOnKettleButton = () => {
	for (const { interactable } of kettleButtonQuery) {
		if (interactable.justPressed) {
			kettleGame.enable()
		}
	}
}
