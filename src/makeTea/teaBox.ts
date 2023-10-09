import { Vector2 } from 'three'
import { assets, ecs, removeParent } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'
import { objectValues } from '@/utils/mapFunctions'

const teaBoxOpenedQuery = ecs.with('teaBoxOpened', 'interactable')
const teaBoxQuery = ecs.with('teaBox', 'interactable')
const infuserQuery = ecs.with('infuser')
const teaCoordinates = [
	[-96, 47],
	[-32, 47],
	[32, 47],
	[-96, -17],
	[-32, -17],
	[32, -17],
	[-32, -81],
	[-96, -81],
	[32, -81],
] as const
export const openTeabox = () => {
	for (const { interactable } of teaBoxQuery) {
		if (interactable.justPressed) {
			if (teaBoxOpenedQuery.size === 0) {
				const box = ecs.add({
					sprite: new Sprite(assets.sprites.TeaBox).setScale(2),
					position: new Vector2(),
					interactable: new Interactable(),
					teaBoxOpened: true,
				})
				const teas = objectValues(assets.tea)
				for (let i = 0; i < teas.length; i++) {
					const coords = teaCoordinates[i]
					ecs.add({
						parent: box,
						sprite: new Sprite(teas[i]).setScale(2),
						interactable: new Interactable(),
						position: new Vector2(coords[0], coords[1]),
						tea: true,
					})
				}
				if (!infuserQuery.size) {
					ecs.add({
						parent: box,
						sprite: new Sprite(assets.sprites.InfuserBox).setRenderOrder(2),
						position: new Vector2(95, -30),
						pickable: true,
						interactable: new Interactable(),
						infuser: true,
					})
				}
			} else {
				for (const entity of teaBoxOpenedQuery) {
					ecs.remove(entity)
				}
			}
		}
	}
}

const infuserPickedUpQuery = infuserQuery.with('picked')

export const closeTeaBox = () => {
	for (const infuser of infuserPickedUpQuery) {
		for (const teabox of teaBoxOpenedQuery) {
			if (!teabox.interactable.hover) {
				removeParent(infuser)
				ecs.remove(teabox)
			}
		}
	}
}
