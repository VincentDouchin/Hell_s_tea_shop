import { Group } from 'three'
import { ecs } from './init'

const currentSceneQuery = ecs.with('scene', 'currentScene')
export const addToScene = () => {
	const sub = new Array<() => () => void>()
	for (const component of ['sprite', 'camera', 'cssObject', 'sceneBackground'] as const) {
		const query = ecs.with(component, 'position')
		const withoutGroup = query.without('group')
		sub.push(() => withoutGroup.onEntityAdded.subscribe((entity) => {
			const group = new Group()
			group.position.x = entity.position.x
			group.position.y = entity.position.y
			group.add(entity[component])
			ecs.addComponent(entity, 'group', group)
		}))
		const withGroup = query.with('group')
		sub.push(() => withGroup.onEntityAdded.subscribe((entity) => {
			for (const { scene } of currentSceneQuery) {
				entity.group.add(entity[component])
				if (entity.parent?.group) {
					entity.parent.group.add(entity.group)
				} else {
					scene.add(entity.group)
				}
			}
		}))
		sub.push(() => withGroup.onEntityRemoved.subscribe((entity) => {
			entity.group.removeFromParent()
		}))
	}
	return sub
}

export const addShaders = () => {
	const sub = new Array<() => () => void>()
	for (const shader of ['outlineShader', 'colorShader'] as const) {
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
const renderOrderQuery = ecs.with('group')
export const changeRenderOrder = () => {
	for (const entity of renderOrderQuery) {
		const { group, renderOrder, parent } = entity
		group.renderOrder = (renderOrder ?? 1) + (parent?.group?.renderOrder ?? 0)
	}
}