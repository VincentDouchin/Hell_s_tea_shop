import { ecs } from './init'

const positionQuery = ecs.with('position', 'group')
export const updatePosition = () => {
	for (const { position, group } of positionQuery) {
		group.position.x = position.x
		group.position.y = position.y
	}
}
