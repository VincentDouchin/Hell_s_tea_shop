import { OrthographicCamera, Vector2 } from 'three'
import { ecs } from './init'
import { cssRenderer, renderer } from './rendering'

export const spawnCamera = () => {
	const width = window.innerWidth
	const height = window.innerHeight

	const camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
	camera.position.z = 10
	ecs.add({ camera, position: new Vector2() })
}
const cameraBoundsQuery = ecs.with('cameraBounds', 'sprite', 'position')
export const cameraQuery = ecs.with('camera')
export const initializeCameraBounds = () => {
	return cameraBoundsQuery.onEntityAdded.subscribe(({ cameraBounds, position, sprite }) => {
		cameraBounds.min.x ??= position.x - sprite.scaledDimensions.x
		cameraBounds.max.x ??= position.x + sprite.scaledDimensions.x
		cameraBounds.min.y ??= position.y - sprite.scaledDimensions.y
		cameraBounds.max.y ??= position.y + sprite.scaledDimensions.y
	})
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

		let zoom: null | number = null
		for (const { sprite } of cameraBoundsQuery) {
			zoom = window.innerWidth / sprite.scaledDimensions.x
		}
		for (const { camera } of cameraQuery) {
			if (zoom) {
				camera.zoom = zoom
				camera.updateProjectionMatrix()
			}
		}
	}
}
