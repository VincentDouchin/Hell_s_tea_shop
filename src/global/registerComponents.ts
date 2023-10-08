import { Group } from 'three'
import { ecs } from './init'
import { scene } from './rendering'

export const addToScene = () => {
	for (const component of ['sprite', 'camera', 'object'] as const) {
		const query = ecs.with(component, 'position')
		const withoutGroup = query.without('group')
		withoutGroup.onEntityAdded.subscribe((entity) => {
			const group = new Group()
			group.add(entity[component])
			ecs.addComponent(entity, 'group', group)
			if (entity.parent?.group) {
				entity.parent.group.add(group)
			} else {
				scene.add(group)
			}
		})
		const withGroup = query.with('group')
		withGroup.onEntityAdded.subscribe((entity) => {
			entity.group.add(entity[component])
		})
		query.onEntityRemoved.subscribe((entity) => {
			entity[component].removeFromParent()
		})
	}
}

export const addShaders = () => {
	for (const shader of ['outlineShader'] as const) {
		const query = ecs.with(shader, 'sprite')
		query.onEntityAdded.subscribe((entity) => {
			entity.sprite.composer.addPass(entity[shader])
		})
		query.onEntityRemoved.subscribe((entity) => {
			entity.sprite.composer.removePass(entity[shader])
		})
	}
}
