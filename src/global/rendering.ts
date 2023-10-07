import { Scene, WebGLRenderer } from 'three'
import { camera } from './camera'

export const renderer = new WebGLRenderer({ antialias: true, alpha: true })
export const scene = new Scene()
export const render = () => {
	renderer.render(scene, camera)
}
