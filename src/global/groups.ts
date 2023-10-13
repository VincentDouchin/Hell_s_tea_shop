import { ecs } from './init'

const renderOrderQuery = ecs.with('renderOrder', 'group')
export const setRenderOrder = () => {
	for (const entity of renderOrderQuery) {
		entity.group.renderOrder = entity.renderOrder + (entity.parent?.renderOrder ?? 0)
	}
}