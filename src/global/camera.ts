import { Box2, OrthographicCamera, Vector2 } from 'three'
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
export const moveCamera = () => {
	for (const { position, camera } of cameraQuery) {
		const camerax = camera.right / camera.zoom
		const cameray = camera.top / camera.zoom
		for (const pointer of PointerInput.all) {
			const xForce = (Math.abs(pointer.position.x) - 0.8) * 20
			const yForce = (Math.abs(pointer.position.y) - 0.8) * 20
			if (pointer.position.x > 0.8) {
				position.x += xForce
			}
			if (pointer.position.x < -0.8) {
				position.x -= xForce
			}
			if (pointer.position.y > 0.9) {
				position.y += yForce
			}
			if (pointer.position.y < -0.9) {
				position.y -= yForce
			}
			for (const { cameraBounds } of cameraBoundsQuery) {
				position.x = Math.max(position.x, cameraBounds.min.x + camerax)
				position.x = Math.min(position.x, cameraBounds.max.x - camerax)
				position.y = Math.max(position.y, cameraBounds.min.y + cameray)
				position.y = Math.min(position.y, cameraBounds.max.y - cameray)
			}
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
