import { Group } from 'three'
import { ecs } from './init'
import { scene } from './rendering'

export const addToScene = () => {
	const sub = new Array<() => () => void>()
	for (const component of ['sprite', 'camera'] as const) {
		const query = ecs.with(component, 'position')
		const withoutGroup = query.without('group')
		sub.push(() => withoutGroup.onEntityAdded.subscribe((entity) => {
			const group = new Group()
			group.position.x = entity.position.x
			group.position.y = entity.position.y
			group.add(entity[component])
			ecs.addComponent(entity, 'group', group)
			if (entity.parent?.group) {
				entity.parent.group.add(group)
			} else {
				scene.add(group)
			}
		}))
		const withGroup = query.with('group')
		sub.push(() => withGroup.onEntityAdded.subscribe((entity) => {
			entity.group.add(entity[component])
		}))
		sub.push(() => query.onEntityRemoved.subscribe((entity) => {
			entity[component].removeFromParent()
		}))
	}
	return sub
}

export const addShaders = () => {
	const sub = new Array<() => () => void>()
	for (const shader of ['outlineShader'] as const) {
		const query = ecs.with(shader, 'sprite')
		sub.push(() => query.onEntityAdded.subscribe((entity) => {
			entity.sprite.composer.addPass(entity[shader])
		}))
		sub.push(() => query.onEntityRemoved.subscribe((entity) => {
			entity.sprite.composer.removePass(entity[shader])
		}))
	}
	return sub
}
