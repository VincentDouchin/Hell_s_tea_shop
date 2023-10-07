export class State {
	static #states = new Set<State>()
	static update() {
		for (const state of this.#states) {
			state.#update()
		}
	}

	#enterSystems = new Array<() => void>()
	#updateSystems = new Array<() => void>()
	#exitSystems = new Array<() => void>()
	onEnter(...systems: Array<() => void>) {
		this.#enterSystems.push(...systems)
		return this
	}

	onUpdate(...systems: Array<() => void>) {
		this.#updateSystems.push(...systems)
		return this
	}

	onExit(...systems: Array<() => void>) {
		this.#exitSystems.push(...systems)
		return this
	}

	#update() {
		for (const system of this.#updateSystems) {
			system()
		}
	}

	#enter() {
		for (const system of this.#enterSystems) {
			system()
		}
	}

	#exit() {
		for (const system of this.#exitSystems) {
			system()
		}
	}

	enable() {
		this.#enter()
		State.#states.add(this)
	}

	disable() {
		this.#exit()
		State.#states.delete(this)
	}
}
