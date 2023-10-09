import { Vector2 } from 'three'
import type { Entity } from '@/global/init'
import { assets, despawnOfType, ecs } from '@/global/init'
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
		temperature: 0,
	})
	ecs.add({
		parent: kettle,
		atlas: new TextureAltas(assets.atlas.kettleTemperatureGauge),
		position: new Vector2(-6, -22),
		temperatureGauge: true,
	})
	ecs.add({
		parent: kettle,
		sprite: new Sprite(assets.sprites.kettleButton),
		position: new Vector2(10.5, -21.5),
		interactable: new Interactable(),
		kettleButton: true,
	})
}
const kettleQuery = ecs.with('kettle', 'temperature')
const kettleButtonQuery = ecs.with('kettleButton', 'interactable')
const kettleTableau = ecs.with('kettleTableau', 'buttonsToClick')
const spawnKettleButtons = () => {
	for (const kettleButton of kettleButtonQuery) {
		if (!kettleTableau.size) {
			const tableau = ecs.add({
				sprite: new Sprite(assets.sprites.Tableu),
				position: new Vector2(50, 0),
				parent: kettleButton,
				kettleTableau: true,
				buttonsToClick: 3,

			})
			for (const x of [-20, 0, 20]) {
				for (const y of [-25, 0, 25]) {
					ecs.add({
						atlas: new TextureAltas(assets.atlas.BlueButton),
						position: new Vector2(x, y),
						parent: tableau,
						buttonToClick: false,
						interactable: new Interactable(),
					})
				}
			}
		}
	}
}
const temperatureGaugeQuery = ecs.with('atlas', 'temperatureGauge', 'parent')
export const setTemperature = () => {
	for (const kettle of kettleQuery) {
		for (const { atlas, parent } of temperatureGaugeQuery) {
			if (parent === kettle) {
				atlas.index = kettle.temperature
			}
		}
	}
}
const increaseTemperature = () => {
	for (const kettle of kettleQuery) {
		kettle.temperature = Math.min(kettle.temperature + 1, 7)
	}
}
const buttonsToClickQuery = ecs.with('buttonToClick', 'sprite', 'atlas', 'interactable')
const setButtonToClick = () => {
	if (buttonsToClickQuery.entities.every(x => !x.buttonToClick)) {
		buttonsToClickQuery.entities[Math.floor(Math.random() * buttonsToClickQuery.size)].buttonToClick = true
	}
}
const clickOnButton = () => {
	for (const entity of buttonsToClickQuery) {
		if (entity.interactable.justPressed && entity.buttonToClick) {
			entity.buttonToClick = false
			for (const tableau of kettleTableau) {
				tableau.buttonsToClick -= 1
			}
		}
	}
}

const changeButtonToClickSprite = () => {
	for (const { atlas, buttonToClick } of buttonsToClickQuery) {
		atlas.atlas = buttonToClick ? assets.atlas.RedButton : assets.atlas.BlueButton
	}
}
const finishGame = () => {
	for (const { buttonsToClick } of kettleTableau) {
		if (buttonsToClick === 0) {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			kettleGame.disable()
		}
	}
}

export const kettleGame = new State()
	.onEnter(spawnKettleButtons)
	.onUpdate(setButtonToClick, changeButtonToClickSprite, clickOnButton, finishGame)
	.onExit(despawnOfType('kettleTableau'), increaseTemperature)

export const clickOnKettleButton = () => {
	for (const { interactable } of kettleButtonQuery) {
		if (interactable.justPressed) {
			kettleGame.enable()
		}
	}
}
