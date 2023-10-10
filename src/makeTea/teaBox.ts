import { Vector2 } from 'three'
import { Pickable } from './pickup'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'
import { objectValues } from '@/utils/mapFunctions'

const teaBoxOpenedQuery = ecs.with('teaBoxOpened', 'interactable')
const teaBoxQuery = ecs.with('teaBox', 'interactable')
const infuserQuery = ecs.with('sprite', 'infuser')
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
						showInteractable: true,
						position: new Vector2(coords[0], coords[1]),
						tea: true,
					})
				}
				if (!infuserQuery.size) {
					ecs.add({
						sprite: new Sprite(assets.sprites.InfuserBox).setRenderOrder(2),
						position: new Vector2(95, -30),
						pickable: new Pickable(assets.ui.InfuserCursor),
						interactable: new Interactable(),
						showInteractable: true,
						infuser: true,
					})
				} else {
					for (const { sprite } of infuserQuery) {
						sprite.setOpacity(1)
					}
				}
			} else {
				for (const entity of teaBoxOpenedQuery) {
					ecs.remove(entity)
				}
				for (const { sprite } of infuserQuery) {
					sprite.setOpacity(0)
				}
			}
		}
	}
}

const filledInfuserQuery = ecs.with('infuserFilled', 'sprite')
export const changeInfuserSprite = () => {
	for (const { sprite } of filledInfuserQuery) {
		sprite.texture = assets.sprites.InfuserFull
	}
}
