import type { OrthographicCamera } from 'three'
import { Raycaster, Vector2, Vector3 } from 'three'
import { renderer } from './rendering'
import { ecs } from '@/global/init'

export class Interactable {
	#hover = false
	#wasHovered = false
	#pressed = false
	#wasPressed = false
	lastTouchedBy: null | PointerInput = null
	position = new Vector2()
	dimensions = new Vector2()
	constructor(public x?: number, public y?: number) {	}

	get pressed() {
		return this.#pressed
	}

	set pressed(state: boolean) {
		this.#wasPressed = this.pressed
		this.#pressed = state
	}

	get justPressed() {
		return this.#wasPressed === false && this.#pressed === true
	}

	get justReleased() {
		return this.#wasPressed === true && this.#pressed === false
	}

	set hover(state: boolean) {
		this.#wasHovered = this.#hover
		this.#hover = state
	}

	get hover() {
		return this.#hover
	}

	get justEntered() {
		return this.#wasHovered === false && this.#hover === true
	}

	get justLeft() {
		return this.#wasHovered === true && this.#hover === false
	}
}

export class PointerInput {
	static pointers = new Map<string | number, PointerInput>()
	static get all() {
		return Array.from(PointerInput.pointers.values())
	}

	position = new Vector2()
	screenPosition = new Vector2()
	pressed = false
	constructor(private down: string, private up: string) {
	}

	setFromScreenCoords(element: HTMLElement, event: string, e: Touch | MouseEvent) {
		const bounds = element.getBoundingClientRect()
		this.screenPosition.x = e.clientX
		this.screenPosition.y = e.clientY
		const x = ((e.clientX - bounds.left) / element.clientWidth) * 2 - 1
		const y = 1 - ((e.clientY - bounds.top) / element.clientHeight) * 2
		this.position = new Vector2(x, y)
		if (event === this.down) {
			this.pressed = true
		} else if (event === this.up) {
			this.pressed = false
		}
	}

	getRay(camera: OrthographicCamera) {
		const raycaster = new Raycaster()
		raycaster.setFromCamera(this.position, camera)
		return raycaster
	}

	getPositionFromCamera(camera: OrthographicCamera) {
		const raycaster = new Raycaster()
		raycaster.setFromCamera(this.position, camera)
		const origin = new Vector2(raycaster.ray.origin.x, raycaster.ray.origin.y)
		return origin
	}
}

export const updateMousePosition = () => {
	for (const event of ['mouseup', 'mousemove', 'mousedown'] as const) {
		document.addEventListener(event, (e) => {
			e.preventDefault()
			const mouseInput = PointerInput.pointers.get('mouse')
			if (!mouseInput) {
				PointerInput.pointers.set('mouse', new PointerInput('mousedown', 'mouseup'))
			} else {
				mouseInput.setFromScreenCoords(renderer.domElement, event, e)
			}
		})
	}
	for (const event of ['touchstart', 'touchmove', 'touchend'] as const) {
		window.addEventListener(event, (e) => {
			e.preventDefault()
			for (const changedTouch of e.changedTouches) {
				const touchInput = PointerInput.pointers.get(changedTouch.identifier)
				if (!touchInput) {
					PointerInput.pointers.set(changedTouch.identifier, new PointerInput('touchstart', 'touchend'))
				} else {
					touchInput.setFromScreenCoords(renderer.domElement, event, changedTouch)
				}
			}
		})
	}
}

const worldInteractablesQuery = ecs.with('interactable', 'sprite')
const cameraQuery = ecs.with('camera')
// const uiInteractablesQuery = ecs.query.pick(Interactable, UIElement)
const interactableQuery = ecs.with('interactable')
export const detectInteractions = () => {
	const camera = cameraQuery.entities[0].camera
	if (camera) {
		// ! Update interactable position in world space
		for (const { interactable, sprite } of worldInteractablesQuery) {
			let pos = new Vector3()
			pos = pos.setFromMatrixPosition(sprite.matrixWorld)
			pos.project(camera)
			const widthHalf = window.innerWidth / 2
			const heightHalf = window.innerHeight / 2

			interactable.position.x = (pos.x * widthHalf) + widthHalf
			interactable.position.y = -(pos.y * heightHalf) + heightHalf

			interactable.dimensions.x = (interactable.x ?? sprite.scaledDimensions.x) * camera.zoom
			interactable.dimensions.y = (interactable.x ?? interactable.y ?? sprite.scaledDimensions.y) * camera.zoom
		}
	}
	// // ! Update interactable position in screen space
	// for (const [interactable, uiElement] of uiInteractablesQuery.getAll()) {
	// 	const bounds = uiElement.getBoundingClientRect()
	// 	interactable.position.x = bounds.x + bounds.width / 2
	// 	interactable.position.y = bounds.y + bounds.height / 2
	// 	interactable.dimensions.x = bounds.width
	// 	interactable.dimensions.y = bounds.height
	// }

	const hovered: Interactable[] = []
	const pressed: Interactable[] = []
	for (const { interactable } of interactableQuery) {
		interactable.lastTouchedBy = null
		for (const pointer of PointerInput.all) {
			const left = interactable.position.x - interactable.dimensions.x / 2
			const right = interactable.position.x + interactable.dimensions.x / 2
			const top = interactable.position.y + interactable.dimensions.y / 2
			const bottom = interactable.position.y - interactable.dimensions.y / 2
			if (pointer.screenPosition.x > left && pointer.screenPosition.x < right && pointer.screenPosition.y < top && pointer.screenPosition.y > bottom) {
				hovered.push(interactable)
				interactable.lastTouchedBy = pointer
				if (pointer.pressed) {
					pressed.push(interactable)
				}
			}
		}
		interactable.hover = hovered.includes(interactable)
		interactable.pressed = pressed.includes(interactable)
	}
}
