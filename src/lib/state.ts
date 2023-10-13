export class State {
	static #states = new Set<State>()
	static update() {
		for (const state of this.#states) {
			state.#update()
		}
	}

	get active() {
		return State.#states.has(this)
	}

	#enterSystems = new Array<() => void>()
	#updateSystems = new Array<() => void>()
	#exitSystems = new Array<() => void>()
	#subscribers = new Array<() => () => void>()
	#unsubscribers = new Array<() => void>()
	onEnter(...systems: Array<() => void>) {
		this.#enterSystems.push(...systems)
		return this
	}

	addSubscribers(...subscribers: Array<() => () => void>) {
		this.#subscribers.push(...subscribers)
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

	enable() {
		this.#unsubscribers.push(...this.#subscribers.map(sub => sub()))
		for (const system of this.#enterSystems) {
			system()
		}
		State.#states.add(this)
		return this
	}

	disable() {
		for (const unsubscriber of this.#unsubscribers) {
			unsubscriber()
		}
		this.#unsubscribers = []
		for (const system of this.#exitSystems) {
			system()
		}
		State.#states.delete(this)
		return this
	}
}
