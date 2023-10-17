import { Vector2 } from 'three'
import { Pickable, Slot } from './pickup'
import type { Entity } from '@/global/init'
import { assets, despawnOfType, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { TextureAltas } from '@/lib/atlas'
import { Sprite } from '@/lib/sprite'
import { State } from '@/lib/state'
import { UIElement } from '@/UI/UiElement'
import { Timer, time } from '@/lib/time'
import { Tooltip } from '@/UI/tooltip'

export const kettle = (parent: Entity) => {
	const kettle = ecs.add({
		sprite: new Sprite(assets.sprites.Kettle1),
		position: new Vector2(-200, -70),
		interactable: new Interactable(),
		showInteractable: true,
		pickable: new Pickable(Slot.Kettle, assets.ui.KettleCursor),
		kettle: true,
		parent,
		temperature: { temperature: 0, timer: new Timer(5000) },
	})
	const gauge = ecs.add({
		parent: kettle,
		sprite: new Sprite(assets.sprites.kettleTemperatureGauge),
		position: new Vector2(-6, -22),
		interactable: new Interactable(),
		temperatureGauge: true,
	})
	ecs.add({
		...new UIElement({ display: 'none' }).ninceSlice(assets.ui.frameSimple, 3).withWorldPosition(0, 10),
		tooltip: Tooltip.Temperature,
		parent: gauge,
	})
	ecs.add({
		parent: kettle,
		sprite: new Sprite(assets.sprites.kettleButton),
		position: new Vector2(10.5, -21.5),
		interactable: new Interactable(),
		showInteractable: true,
		kettleButton: true,
	})
}
const kettleQuery = ecs.with('kettle', 'temperature')
const kettleButtonQuery = ecs.with('kettleButton', 'interactable')
const kettleTableauQuery = ecs.with('kettleTableau', 'buttonsToClick')
const buttonsToClickQuery = ecs.with('buttonToClick', 'sprite', 'atlas', 'interactable')

export const reduceTemperature = () => {
	for (const { temperature } of kettleQuery) {
		temperature.timer.tick(time.delta)
		if (temperature.timer.justFinished) {
			temperature.temperature = Math.max(temperature.temperature - 1, 0)
		}
	}
}

const spawnKettleButtons = () => {
	for (const kettleButton of kettleButtonQuery) {
		if (!kettleTableauQuery.size) {
			const tableau = ecs.add({
				sprite: new Sprite(assets.sprites.Tableu),
				position: new Vector2(50, 0),
				parent: kettleButton,
				kettleTableau: true,
				buttonsToClick: { amount: 3, last: null },

			})
			ecs.add({
				parent: tableau,
				sprite: new Sprite(assets.sprites.close),
				position: new Vector2(23, 38),
				interactable: new Interactable(),
				showInteractable: true,
				closeTableau: true,
			})
			for (const x of [-20, 0, 20]) {
				for (const y of [-30, -5, 20]) {
					ecs.add({
						atlas: new TextureAltas(assets.atlas.BlueButton),
						position: new Vector2(x, y),
						parent: tableau,
						buttonToClick: false,
						interactable: new Interactable(),
						showInteractable: true,
					})
				}
			}
		}
	}
}
const temperatureGaugeQuery = ecs.with('sprite', 'temperatureGauge', 'parent')
export const setTemperature = () => {
	for (const kettle of kettleQuery) {
		for (const { sprite, parent } of temperatureGaugeQuery) {
			if (parent === kettle) {
				sprite.rotation.z = -Math.PI * 2 * kettle.temperature.temperature / 100
			}
		}
	}
}
const resetTableau = () => {
	for (const entity of kettleTableauQuery) {
		if (entity.buttonsToClick.amount === 0) {
			for (const kettle of kettleQuery) {
				kettle.temperature.temperature = Math.min(kettle.temperature.temperature + 10, 100)
			}
			entity.buttonsToClick.amount = 3
		}
	}
}

const setButtonToClick = () => {
	for (const { buttonsToClick } of kettleTableauQuery) {
		if (buttonsToClickQuery.entities.every(x => !x.buttonToClick)) {
			const buttons = buttonsToClickQuery.entities.filter(button => button !== buttonsToClick.last)
			const entity = buttons[Math.floor(Math.random() * buttons.length)]
			entity.buttonToClick = true
			buttonsToClick.last = entity
		}
	}
}
const clickOnButton = () => {
	for (const entity of buttonsToClickQuery) {
		if (entity.interactable.justPressed && entity.buttonToClick) {
			entity.buttonToClick = false
			for (const tableau of kettleTableauQuery) {
				tableau.buttonsToClick.amount -= 1
			}
		}
	}
}

const changeButtonToClickSprite = () => {
	for (const { atlas, buttonToClick } of buttonsToClickQuery) {
		atlas.atlas = buttonToClick ? assets.atlas.RedButton : assets.atlas.BlueButton
	}
}
const closeKettleTableauQuery = ecs.with('interactable', 'closeTableau')
const finishGame = () => {
	for (const { interactable } of closeKettleTableauQuery) {
		if (interactable.justPressed) {
			// eslint-disable-next-line ts/no-use-before-define
			kettleGame.disable()
		}
	}
}

export const kettleGame = new State()
	.onEnter(spawnKettleButtons)
	.onUpdate(setButtonToClick, changeButtonToClickSprite, clickOnButton, finishGame, resetTableau)
	.onExit(despawnOfType('kettleTableau'))

export const clickOnKettleButton = () => {
	for (const { interactable } of kettleButtonQuery) {
		if (interactable.justPressed) {
			kettleGame.enable()
		}
	}
}
