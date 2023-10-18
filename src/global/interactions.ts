import type { Object3D, OrthographicCamera } from 'three'
import { Raycaster, Vector2, Vector3 } from 'three'
import { currentSceneQuery, renderer } from './rendering'
import type { Entity } from '@/global/init'
import { ecs } from '@/global/init'
import type { Sprite } from '@/lib/sprite'

export class Interactable {
	#hover = false
	#wasHovered = false
	#pressed = false
	#wasPressed = false
	lastTouchedBy: null | PointerInput = null
	position = new Vector2()
	dimensions = new Vector2()
	constructor(public x?: number, public y?: number) {	}
	enabled = true
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

	picked: Entity | null = null
	position = new Vector2()
	screenPosition = new Vector2()
	pressed = false
	rightPressed = false
	constructor(private down: string, private up: string) {
	}

	setFromScreenCoords(element: HTMLElement, event: string, e: Touch | MouseEvent) {
		const bounds = element.getBoundingClientRect()
		this.screenPosition.x = e.clientX
		this.screenPosition.y = e.clientY
		this.position.x = ((e.clientX - bounds.left) / element.clientWidth) * 2 - 1
		this.position.y = 1 - ((e.clientY - bounds.top) / element.clientHeight) * 2
		if (event === this.down) {
			this.pressed = true
		} else if (event === this.up) {
			this.pressed = false
		}
		if (e instanceof MouseEvent && e.button === 2) {
			if (event === this.down) {
				this.rightPressed = true
			} else if (event === this.up) {
				this.rightPressed = false
			}
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
	document.addEventListener('contextmenu', e => e.preventDefault())
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

const worldInteractablesQuery = ecs.with('interactable', 'sprite', 'group')
const cameraQuery = ecs.with('camera')
const uiInteractablesQuery = ecs.with('uiElement', 'interactable')
const interactableQuery = ecs.with('interactable')
export const detectInteractions = () => {
	const camera = cameraQuery.entities[0].camera
	const sprites: Sprite[] = []
	if (camera) {
		// ! Update interactable position in world space
		for (const { interactable, sprite, group } of worldInteractablesQuery) {
			for (const { scene } of currentSceneQuery) {
				if (scene.getObjectById(group.id)) {
					sprites.push(sprite)
					let pos = new Vector3()
					pos = pos.setFromMatrixPosition(sprite.matrixWorld)
					pos.project(camera)
					const widthHalf = window.innerWidth / 2
					const heightHalf = window.innerHeight / 2

					interactable.position.x = (pos.x * widthHalf) + widthHalf
					interactable.position.y = -(pos.y * heightHalf) + heightHalf

					interactable.dimensions.x = (interactable.x ?? sprite.scaledDimensions.x) * camera.zoom
					interactable.dimensions.y = (interactable.x ?? interactable.y ?? sprite.scaledDimensions.y) * camera.zoom
					interactable.enabled = true
				} else {
					interactable.enabled = false
				}
			}
		}
	}
	// ! Update interactable position in screen space
	for (const { interactable, uiElement } of uiInteractablesQuery) {
		const bounds = uiElement.getBoundingClientRect()
		interactable.position.x = bounds.x + bounds.width / 2
		interactable.position.y = bounds.y + bounds.height / 2
		interactable.dimensions.x = bounds.width
		interactable.dimensions.y = bounds.height
	}

	const hovered = new Set<Interactable>()
	const pressed = new Set<Interactable>()
	const toIgnore = new Set<Object3D>()

	for (const pointer of PointerInput.all) {
		const interesected = pointer.getRay(camera).intersectObjects(sprites).map(x => x.object).sort((a, b) => (b.parent?.renderOrder ?? 0) - (a.parent?.renderOrder ?? 0))
		for (const interactableEntity of interactableQuery) {
			const { interactable, parent, sprite } = interactableEntity
			if (interactable.enabled) {
				if (sprite) {
					if (interesected[0] === sprite) {
						hovered.add(interactable)
						interactable.lastTouchedBy = pointer
						if (parent?.interactable) {
							hovered.delete(parent?.interactable)
							pressed.delete(parent?.interactable)
						}
						if (pointer.pressed) {
							pressed.add(interactable)
						}
					}
				} else {
					const left = interactable.position.x - interactable.dimensions.x / 2
					const right = interactable.position.x + interactable.dimensions.x / 2
					const top = interactable.position.y + interactable.dimensions.y / 2
					const bottom = interactable.position.y - interactable.dimensions.y / 2
					if (pointer.screenPosition.x > left && pointer.screenPosition.x < right && pointer.screenPosition.y < top && pointer.screenPosition.y > bottom) {
						hovered.add(interactable)
						if (parent?.interactable) {
							hovered.delete(parent?.interactable)
							pressed.delete(parent?.interactable)
						}
						interactable.lastTouchedBy = pointer
						if (pointer.pressed) {
							pressed.add(interactable)
						}
					}
				}
			}
		}
	}
	for (const { interactable, sprite } of interactableQuery) {
		const isIgnored = sprite && toIgnore.has(sprite)
		interactable.hover = hovered.has(interactable) && interactable.enabled && !isIgnored
		interactable.pressed = pressed.has(interactable) && interactable.enabled && !isIgnored
	}
}
