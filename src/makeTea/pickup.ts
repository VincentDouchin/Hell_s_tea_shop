import { cameraQuery } from '@/global/camera'
import { ecs } from '@/global/init'
import { OutlineShader } from '@/shaders/OutlineShader'

const interactableQuery = ecs.with('interactable', 'sprite')
export const showPickupItems = () => {
	for (const entity of interactableQuery.entities) {
		const { interactable, outlineShader } = entity
		if (interactable.hover && !outlineShader) {
			ecs.addComponent(entity, 'outlineShader', new OutlineShader())
		}
		if (!interactable.hover && outlineShader) {
			ecs.removeComponent(entity, 'outlineShader')
		}
	}
}

const pickableQuery = ecs.with('pickable', 'interactable')
export const pickupItems = () => {
	for (const entity of pickableQuery.entities) {
		const { interactable } = entity
		if (interactable.justPressed && interactable.lastTouchedBy) {
			ecs.addComponent(entity, 'picked', interactable.lastTouchedBy)
		}
	}
}
const pickedQuery = ecs.with('picked', 'position')

export const releaseItems = () => {
	for (const entity of pickableQuery.entities) {
		if (!entity.picked?.pressed) {
			ecs.removeComponent(entity, 'picked')
		}
	}
}
export const updatedPickedItemsPosition = () => {
	const camera = cameraQuery.entities[0].camera
	if (camera) {
		for (const { picked, position } of pickedQuery.entities) {
			position.x = picked.position.x	* camera.right / camera.zoom
			position.y = picked.position.y * camera.top / camera.zoom
		}
	}
}
