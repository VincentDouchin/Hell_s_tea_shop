import { Color, ShaderMaterial, Uniform } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from './glsl/main.vert?raw'
import fragmentShader from './glsl/outline.frag?raw'
import { ecs } from '@/global/init'

export const shader = new ShaderMaterial({ vertexShader, fragmentShader })

export class OutlineShader extends ShaderPass {
	constructor(color: Color = new Color(0xFFFFFF), opacity = 1) {
		super(shader.clone())
		this.uniforms.color = new Uniform([color.r, color.g, color.b, opacity])
	}

	setSize(x: number, y: number) {
		this.uniforms.size = new Uniform([x, y])
	}
}
export const addedOutlineShader = () => ecs.with('sprite', 'outlineShader').onEntityAdded.subscribe(({ sprite, outlineShader }) => {
	outlineShader.setSize(sprite.width, sprite.height)
})
