import { LinearSRGBColorSpace, Scene, Vector2, WebGLRenderer } from 'three'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { assets, ecs } from './init'
import { Background } from '@/lib/background'

export const renderer = new WebGLRenderer({ antialias: true, alpha: true })
export const cssRenderer = new CSS2DRenderer()
export const kitchenScene = new Scene()
export const servingScene = new Scene()
const sceneQuery = ecs.with('scene')
export const setCurrentScene = (newCurrentScene: Scene) => () => {
	for (const entity of sceneQuery) {
		if (entity.scene === newCurrentScene) {
			ecs.addComponent(entity, 'currentScene', true)
		} else {
			ecs.removeComponent(entity, 'currentScene')
		}
	}
}
export const spawnBackground = () => {
	ecs.add({
		sceneBackground: new Background(assets.sprites.Wallpaper),
		position: new Vector2(0, 0),
	})
}
export const initRendering = () => {
	ecs.add({ scene: kitchenScene, currentScene: true })
	ecs.add({ scene: servingScene })

	const initRenderer = (renderer: WebGLRenderer | CSS2DRenderer) => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(renderer.domElement)
	}
	initRenderer(renderer)
	initRenderer(cssRenderer)
	cssRenderer.domElement.style.position = 'fixed'
	renderer.outputColorSpace = LinearSRGBColorSpace
	renderer.setClearColor(0xFFFFFF, 0)
}
const cameraQuery = ecs.with('camera')
export const currentSceneQuery = ecs.with('scene', 'currentScene')
export const render = () => {
	for (const { camera } of cameraQuery) {
		for (const { scene } of currentSceneQuery) {
			renderer.render(scene, camera)
			cssRenderer.render(scene, camera)
		}
	}
}
