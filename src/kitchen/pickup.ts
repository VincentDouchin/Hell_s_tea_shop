import type { With } from 'miniplex'
import type { Texture, Vector2 } from 'three'
import { easing } from 'ts-easing'
import { Liquid } from './pour'
import { type Spice, Spices } from '@/constants/spices'
import type { Entity } from '@/global/init'
import { assets, ecs, removeParent } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { PixelTexture } from '@/lib/pixelTexture'
import { Sprite } from '@/lib/sprite'
import { ColorShader } from '@/shaders/ColorShader'
import { OutlineShader } from '@/shaders/OutlineShader'
import { sleep } from '@/utils/sleep'
import { Tween } from '@/utils/tween'

export enum Slot {
	Cup,
	Kettle,
	Infuser,
}

export class Pickable {
	enabled = false
	constructor(public slot: Slot | Spice, public cursor: HTMLCanvasElement) {
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

const interactableQuery = ecs.with('interactable', 'sprite', 'showInteractable', 'position')
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

const pickableQuery = ecs.with('pickable', 'interactable', 'sprite', 'position')
const pickedUpQuery = ecs.with('picked', 'pickable')

export const slotEntity = (sprite: Sprite, position: Vector2, slot: Slot | Spice, defaultSlot = false): Entity => ({
	colorShader: new ColorShader([1, 1, 1, 0.5]),
	interactable: new Interactable(),
	showInteractable: true,
	sprite: new Sprite(sprite.texture),
	position,
	slot,
	defaultSlot,

})
const slotSprites: Record<Slot, Texture> = {
	[Slot.Cup]: assets.sprites.CupEmpty,
	[Slot.Infuser]: assets.sprites.InfuserBox,
	[Slot.Kettle]: assets.sprites.Kettle1,
}

const getSlotSprite = (slot: Slot | Spice) => {
	const spice = Spices.find(spice => spice.name === slot)?.sprite
	return spice ? new PixelTexture(spice) : slotSprites[slot as Slot]
}
const slotsQuery = ecs.with('slot', 'interactable')
const defaultSlotQuery = slotsQuery.with('defaultSlot')
export const pickupItems = () => {
	if (pickedUpQuery.size === 0) {
		for (const entity of pickableQuery) {
			const { interactable, pickable, position, parent } = entity
			if (interactable.justPressed && !interactable.lastTouchedBy?.rightPressed) {
				for (const entity of defaultSlotQuery) {
					if (entity.slot === pickable.slot) {
						ecs.removeComponent(entity, 'defaultSlot')
					}
				}
				sleep(100).then(() => ecs.addComponent(entity, 'picked', true))

				pickable.enable()
				ecs.add({
					...slotEntity(new Sprite(getSlotSprite(pickable.slot)), position, pickable.slot, true),
					parent,
				})
				ecs.removeComponent(entity, 'position')
				removeParent(entity)
			}
		}
	}
}

export const switchSlotWithPickedUp = (slotEntity: With<Entity, 'interactable' | 'slot'>, pickedUpEntity: With<Entity, 'pickable' | 'picked'>) => {
	sleep(100).then(() =>	ecs.removeComponent(pickedUpEntity, 'picked'))
	if (slotEntity.renderOrder) {
		ecs.addComponent(pickedUpEntity, 'renderOrder', slotEntity.renderOrder)
	}
	ecs.addComponent(pickedUpEntity, 'parent', slotEntity.parent)
	ecs.addComponent(pickedUpEntity, 'position', slotEntity.position?.clone())
	pickedUpEntity.pickable.disable()
	ecs.remove(slotEntity)
}

export const releaseItems = () => {
	for (const pickedUpEntity of pickedUpQuery) {
		for (const slotEntity of slotsQuery) {
			if (slotEntity.interactable.justPressed && slotEntity.slot === pickedUpEntity.pickable.slot) {
				switchSlotWithPickedUp(slotEntity, pickedUpEntity)
			}
		}
		if (pickedUpEntity.interactable?.lastTouchedBy?.rightPressed) {
			for (const slotEntity of defaultSlotQuery) {
				if (slotEntity.defaultSlot && slotEntity.slot === pickedUpEntity.pickable.slot) {
					switchSlotWithPickedUp(slotEntity, pickedUpEntity)
				}
			}
		}
	}
}

const teaQuery = ecs.with('tea', 'interactable')
export const pickupTea = () => {
	for (const entity of infuserPickedUpQuery) {
		for (const { interactable, tea } of teaQuery) {
			if (interactable.justReleased) {
				ecs.removeComponent(entity, 'infuserFilled')
				ecs.addComponent(entity, 'infuserFilled', tea)
			}
		}
	}
}

const infuserFullPickedUpQuery = infuserPickedUpQuery.with('infuserFilled')
const cupQuery = ecs.with('cup', 'interactable', 'filled')
export const infuseTea = () => {
	for (const infuserEntity of infuserFullPickedUpQuery) {
		for (const cupEntity of cupQuery) {
			const { cup, interactable, filled } = cupEntity
			if (interactable.justPressed && filled === Liquid.Water) {
				cup.touchedByInfuser += 1
				if (cup.touchedByInfuser === 3) {
					ecs.removeComponent(cupEntity, 'filled')
					ecs.addComponent(cupEntity, 'filled', Liquid.Tea)
					ecs.addComponent(cupEntity, 'tea', infuserEntity.infuserFilled)
					ecs.removeComponent(infuserEntity, 'infuserFilled')
				}
			}
		}
	}
}

export const shakableQuery = ecs.with('shakable', 'interactable').without('shaking')
export const shakeOnHover = () => {
	for (const entity of shakableQuery) {
		if (entity.interactable.justEntered) {
			ecs.addComponent(entity, 'shaking', true)
		}
	}
}

export const shakeItems = () => ecs.with('shaking', 'position').onEntityAdded.subscribe((entity) => {
	const { position } = entity
	const initialPosition = position.x
	new Tween(50).easing(easing.elastic)
		.onUpdate(r => position.x = initialPosition + r, 0, 1)
		.onComplete(() => {
			new Tween(50).easing(easing.elastic)
				.onUpdate(r => position.x = initialPosition + r, 1, 0).onComplete(() => {
					ecs.removeComponent(entity, 'shaking')
				})
		})
})