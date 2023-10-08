import { Liquid } from './pour'
import { cameraQuery } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'
import { OutlineShader } from '@/shaders/OutlineShader'

const infuserPickedUpQuery = ecs.with('infuser', 'picked')
infuserPickedUpQuery.onEntityAdded.subscribe((entity) => {
	if (!entity.infuserFilled) {
		ecs.removeComponent(entity, 'sprite')
		ecs.addComponent(entity, 'sprite', new Sprite(assets.sprites.InfuserOpened).setRenderOrder(2))
	} else if (entity.sprite) {
		entity.sprite.rotation.z = Math.PI
	}
})
infuserPickedUpQuery.onEntityRemoved.subscribe((entity) => {
	ecs.removeComponent(entity, 'sprite')
	const sprite = entity.infuserFilled ? assets.sprites.InfuserFull : assets.sprites.InfuserBox
	ecs.addComponent(entity, 'sprite', new Sprite(sprite).setRenderOrder(2))
})
const interactableQuery = ecs.with('interactable', 'sprite')
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

export const pickupItems = () => {
	if (pickedUpQuery.size === 0) {
		for (const entity of pickableQuery) {
			const { interactable, position } = entity
			if (interactable.justPressed && interactable.lastTouchedBy) {
				ecs.addComponent(entity, 'picked', { initialPosition: position.clone(), input: interactable.lastTouchedBy })
				document.documentElement.style.cursor = 'none'
			}
		}
	}
}
export const releaseItems = () => {
	for (const entity of pickedUpQuery) {
		if (!entity.picked?.input?.pressed) {
			entity.position.x = entity.picked.initialPosition.x
			entity.position.y = entity.picked.initialPosition.y
			ecs.removeComponent(entity, 'picked')
			document.documentElement.style.cursor = 'auto'
		}
	}
}
const pickedQuery = ecs.with('picked', 'position')
export const updatedPickedItemsPosition = () => {
	const camera = cameraQuery.entities[0].camera
	if (camera) {
		for (const { picked, position } of pickedQuery) {
			position.x = picked.input.position.x * camera.right / camera.zoom
			position.y = picked.input.position.y * camera.top / camera.zoom
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
const cupQuery = ecs.with('cup', 'interactable')
export const infuseTea = () => {
	for (const _ of infuserFullPickedUpQuery) {
		for (const cupEntity of cupQuery) {
			const { cup, interactable } = cupEntity
			if (interactable.justEntered) {
				cup.touchedByInfuser += 1
				if (cup.touchedByInfuser === 3) {
					ecs.removeComponent(cupEntity, 'filled')
					ecs.addComponent(cupEntity, 'filled', Liquid.Tea)
				}
			}
		}
	}
}
