import { ecs } from './init'

const positionQuery = ecs.with('position', 'group')
export const updatePosition = () => {
	for (const { position, group } of positionQuery.entities) {
		group.position.x = position.x
		group.position.y = position.y
	}
}
