interface systemSet {
	(): void
	conditions: (() => boolean)[]
	timeout: number
	runIf: (condition: () => boolean) => systemSet
	throttle: (timeout: number) => systemSet
}

export function SystemSet(...systems: Array<() => void>): systemSet {
	let time = Date.now()
	const set: systemSet = function () {
		if ((set.timeout > 0 && (time + set.timeout - Date.now()) < 0) || set.timeout === 0) {
			if (set.conditions.every(condition => condition())) {
				systems.forEach(system => system())
				time = Date.now()
			}
		}
	}
	set.timeout = 0
	set.conditions = []
	set.runIf = (condition: () => boolean) => {
		set.conditions.push(condition)
		return set
	}
	set.throttle = (timeout: number) => {
		set.timeout = timeout
		return set
	}

	return set
}
