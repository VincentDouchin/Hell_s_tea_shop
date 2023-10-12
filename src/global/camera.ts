import { Box2, OrthographicCamera, Texture, Vector2 } from 'three'
import { ecs } from './init'
import { PointerInput } from './interactions'
import { cssRenderer, renderer } from './rendering'

export const spawnCamera = () => {
	const width = window.innerWidth
	const height = window.innerHeight

	const camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
	camera.position.z = 10
	ecs.add({ camera, position: new Vector2() })
}

export class CameraBounds extends Box2 {}
const cameraBoundsQuery = ecs.with('cameraBounds', 'sprite', 'position')
export const cameraQuery = ecs.with('camera', 'position')
const cameraAnchorQuery = cameraBoundsQuery.with('anchor')
export const initializeCameraBounds = () => {
	return cameraBoundsQuery.onEntityAdded.subscribe(({ cameraBounds, position, sprite }) => {
		cameraBounds.min.x = position.x - sprite.scaledDimensions.x / 2
		cameraBounds.max.x = position.x + sprite.scaledDimensions.x / 2
		cameraBounds.min.y = position.y - sprite.scaledDimensions.y / 2
		cameraBounds.max.y = position.y + sprite.scaledDimensions.y / 2
	})
}
export const setCameraZoom = (zoom: number) => () => {
	for (const { camera } of cameraQuery) {
		camera.zoom = zoom
		camera.updateProjectionMatrix()
	}
}
const sceneBackgroundQuery = ecs.with('scene', 'sceneBackground')
const interactableQuery = ecs.with('interactable')
const pickedQuery = ecs.with('picked')
export const moveCamera = () => {
	let initialCameraPosition: null | Vector2 = null
	let initialPointerPosition: null | Vector2 = null
	return () => {
		for (const { position, camera } of cameraQuery) {
			const camerax = camera.right / camera.zoom
			const cameray = camera.top / camera.zoom
			for (const { scene } of sceneBackgroundQuery) {
				if (scene.background && scene.background instanceof Texture) {
					scene.background.offset.x = position.x * scene.background.image.width / window.innerWidth
				}
			}
			for (const pointer of PointerInput.all) {
				if (pointer.pressed) {
					if (interactableQuery.entities.every(({ interactable }) => !interactable.hover) && !pickedQuery.size && !initialCameraPosition && !initialPointerPosition) {
						initialCameraPosition = position.clone()
						initialPointerPosition = pointer.position.clone()
					}
					if (initialCameraPosition && initialPointerPosition) {
						position.x = initialCameraPosition.x - (pointer.position.x - initialPointerPosition.x) * 100
					}
				} else {
					initialCameraPosition = null
					initialPointerPosition = null
				}
			}
			for (const { cameraBounds } of cameraBoundsQuery) {
				position.x = Math.max(position.x, cameraBounds.min.x + camerax)
				position.x = Math.min(position.x, cameraBounds.max.x - camerax)
				position.y = Math.max(position.y, cameraBounds.min.y + cameray)
				position.y = Math.min(position.y, cameraBounds.max.y - cameray)
			}
			for (const { anchor, cameraBounds } of cameraAnchorQuery) {
				if (anchor.bottom) {
					position.y = cameraBounds.min.y + cameray
				}
				if (anchor.top) {
					position.y = cameraBounds.max.y - cameray
				}
				if (anchor.right) {
					position.x = cameraBounds.max.x - camerax
				}
				if (anchor.left) {
					position.x = cameraBounds.min.x + camerax
				}
			}
		}
	}
}

export const adjustScreenSize = () => {
	const screenSize = { x: window.innerWidth, y: window.innerHeight / 2, changed: false }
	window.addEventListener('resize', () => {
		screenSize.x = window.innerWidth
		screenSize.y = window.innerHeight
		screenSize.changed = true
	})

	return () => {
		if (screenSize.changed) {
			for (const anyRenderer of [renderer, cssRenderer]) {
				anyRenderer.setSize(window.innerWidth, window.innerHeight)
			}
			for (const { camera } of cameraQuery) {
				camera.left = -window.innerWidth / 2
				camera.right = window.innerWidth / 2
				camera.bottom = -window.innerHeight / 2
				camera.top = window.innerHeight / 2
			}
		}

		const zoom: null | number = null
		for (const { camera } of cameraQuery) {
			if (zoom) {
				camera.zoom = zoom
				camera.updateProjectionMatrix()
			}
		}
	}
}
