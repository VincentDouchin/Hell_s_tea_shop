import { Box2, OrthographicCamera, RepeatWrapping, Texture, Vector2 } from 'three'
import { ecs } from './init'
import { cssRenderer, renderer } from './rendering'
import { PointerInput } from './interactions'

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
					scene.background.offset.x = position.x / scene.background.image.width
					scene.background.offset.y = position.y / scene.background.image.height
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
export const addSceneBackground = () => sceneBackgroundQuery.onEntityAdded.subscribe((entity) => {
	const texture = entity.sceneBackground.clone()
	texture.repeat.x = window.innerWidth / texture.image.width
	texture.repeat.y = window.innerHeight / texture.image.height
	texture.wrapS = RepeatWrapping
	texture.wrapT = RepeatWrapping
	entity.scene.background = texture
})
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
			for (const { scene, sceneBackground } of sceneBackgroundQuery) {
				if (scene.background && 'repeat' in scene.background) {
					scene.background.repeat.x = window.innerWidth / sceneBackground.image.width
					scene.background.repeat.y = window.innerHeight / sceneBackground.image.height
				}
			}
		}

		const zoom: null | number = null
		// for (const { sprite } of cameraBoundsQuery) {
		// 	zoom = window.innerWidth / sprite.scaledDimensions.x
		// }
		for (const { camera } of cameraQuery) {
			if (zoom) {
				camera.zoom = zoom
				camera.updateProjectionMatrix()
			}
		}
	}
}
