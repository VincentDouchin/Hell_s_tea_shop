import { Vector2 } from 'three'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'

const teaBoxOpenedQuery = ecs.with('teaBoxOpened')
const teaBoxQuery = ecs.with('teaBox', 'interactable')
export const openTeabox = () => {
	for (const { interactable } of teaBoxQuery) {
		if (interactable.justPressed) {
			if (teaBoxOpenedQuery.size === 0) {
				const box = ecs.add({
					sprite: new Sprite(assets.sprites.TeaBox).setScale(2),
					position: new Vector2(),
					teaBoxOpened: true,
				})
				ecs.add({
					parent: box,
					sprite: new Sprite(assets.sprites.tea1).setScale(2),
					interactable: new Interactable(),
					position: new Vector2(-32, 47),
					tea: true,
				})
			} else {
				for (const entity of teaBoxOpenedQuery) {
					ecs.remove(entity)
				}
			}
		}
	}
}
