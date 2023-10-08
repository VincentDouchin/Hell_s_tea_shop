import { LinearSRGBColorSpace, Scene, WebGLRenderer } from 'three'
import { ecs } from './init'

export const renderer = new WebGLRenderer({ antialias: true, alpha: true })
export const scene = new Scene()
export const initRendering = () => {
	const initRenderer = (renderer: WebGLRenderer) => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(renderer.domElement)
	}
	initRenderer(renderer)
	renderer.outputColorSpace = LinearSRGBColorSpace
	renderer.setClearColor(0xFFFFFF, 0)
	renderer.autoClear = false
}
const cameraQuery = ecs.with('camera')
export const render = () => {
	for (const { camera } of cameraQuery) {
		renderer.render(scene, camera)
	}
}
