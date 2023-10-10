import { Liquid } from './pour'
import { ecs } from '@/global/init'
import { ColorShader } from '@/shaders/ColorShader'
import { OutlineShader } from '@/shaders/OutlineShader'
import { sleep } from '@/utils/sleep'

export class Pickable {
	enabled = false
	constructor(public cursor: HTMLCanvasElement) {
	}

	enable() {
		this.enabled = true
		document.body.style.cursor = `url(${this.cursor.toDataURL()}), auto`
	}

	disable() {
		this.enabled = false
		document.body.style.cursor = 'auto'
	}
}

const infuserPickedUpQuery = ecs.with('infuser', 'picked')

const interactableQuery = ecs.with('interactable', 'sprite', 'showInteractable')
export const showPickupItems = () => {
	for (const entity of interactableQuery) {
		const { interactable, outlineShader } = entity
		if (interactable.hover && !outlineShader) {
			ecs.addComponent(entity, 'outlineShader', new OutlineShader())
		}
		if (!interactable.hover && outlineShader) {
			ecs.removeComponent(entity, 'outlineShader')
		}
	}
}

const pickableQuery = ecs.with('pickable', 'interactable', 'position')
const pickedUpQuery = pickableQuery.with('picked')
export const showPickedItems = () => {
	for (const entity of pickableQuery) {
		const { pickable, colorShader } = entity
		if (pickable.enabled && !colorShader) {
			ecs.addComponent(entity, 'colorShader', new ColorShader([1, 1, 1, 0.5]))
		}
		if (!pickable.enabled && colorShader) {
			ecs.removeComponent(entity, 'colorShader')
		}
	}
}

export const pickupItems = () => {
	if (pickedUpQuery.size === 0) {
		for (const entity of pickableQuery) {
			const { interactable, pickable } = entity
			if (interactable.justPressed) {
				sleep(100).then(() => ecs.addComponent(entity, 'picked', true))
				pickable.enable()
			}
		}
	}
}

export const releaseItems = () => {
	for (const entity of pickedUpQuery) {
		if (entity.interactable.justPressed) {
			entity.pickable.disable()
			ecs.removeComponent(entity, 'picked')
		}
	}
}

const teaQuery = ecs.with('tea', 'interactable')
export const pickupTea = () => {
	for (const entity of infuserPickedUpQuery) {
		for (const { interactable } of teaQuery) {
			if (interactable.justReleased) {
				ecs.addComponent(entity, 'infuserFilled', true)
			}
		}
	}
}

const infuserFullPickedUpQuery = infuserPickedUpQuery.with('infuserFilled')
const cupQuery = ecs.with('cup', 'interactable', 'filled')
export const infuseTea = () => {
	if (infuserFullPickedUpQuery.size) {
		for (const cupEntity of cupQuery) {
			const { cup, interactable, filled } = cupEntity
			if (interactable.justPressed && filled === Liquid.Water) {
				cup.touchedByInfuser += 1
				if (cup.touchedByInfuser === 3) {
					ecs.removeComponent(cupEntity, 'filled')
					ecs.addComponent(cupEntity, 'filled', Liquid.Tea)
				}
			}
		}
	}
}
