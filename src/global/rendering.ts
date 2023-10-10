import { LinearSRGBColorSpace, Scene, WebGLRenderer } from 'three'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { ecs } from './init'

export const renderer = new WebGLRenderer({ antialias: true, alpha: true })
export const cssRenderer = new CSS2DRenderer()
export const scene = new Scene()
export const initRendering = () => {
	const initRenderer = (renderer: WebGLRenderer | CSS2DRenderer) => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(renderer.domElement)
	}
	initRenderer(renderer)
	initRenderer(cssRenderer)
	cssRenderer.domElement.style.position = 'fixed'
	renderer.outputColorSpace = LinearSRGBColorSpace
	renderer.setClearColor(0xFFFFFF, 0)
	renderer.autoClear = false
}
const cameraQuery = ecs.with('camera')
export const render = () => {
	for (const { camera } of cameraQuery) {
		renderer.render(scene, camera)
		cssRenderer.render(scene, camera)
	}
}
