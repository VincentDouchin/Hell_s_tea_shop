import { Vector2 } from 'three'
import { Pickable } from './pickup'
import { assets, ecs, removeParent } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'
import { cameraQuery } from '@/global/camera'
import { Teas } from '@/constants/tea'

const teaBoxOpenedQuery = ecs.with('teaBoxOpened', 'interactable')
const teaBoxQuery = ecs.with('teaBox', 'interactable')
const infuserQuery = ecs.with('sprite', 'infuser')

export const openTeabox = () => {
	const teaScale = 1
	const xPositions = [-48, -16, 16]
	const yPositions = [23.5, -8.5, -40.6]

	if (cameraQuery.size) {
		const cameraPosition = cameraQuery.entities[0].position
		for (const { interactable } of teaBoxQuery) {
			if (interactable.justPressed) {
				if (teaBoxOpenedQuery.size === 0) {
					const box = ecs.add({
						sprite: new Sprite(assets.sprites.TeaBox).setScale(teaScale),
						position: cameraPosition,
						interactable: new Interactable(),
						teaBoxOpened: true,
					})
					for (let x = 0; x < 3; x++) {
						for (let y = 0; y < 3; y++) {
							ecs.add({
								parent: box,
								sprite: new Sprite(Teas[x * 3 + y].image).setScale(teaScale),
								interactable: new Interactable(),
								showInteractable: true,
								position: new Vector2(xPositions[x], yPositions[y]),
								tea: true,
							})
						}
					}
					if (!infuserQuery.size) {
						ecs.add({
							parent: box,
							sprite: new Sprite(assets.sprites.InfuserBox).setRenderOrder(teaScale),
							position: new Vector2(47.5, -16),
							pickable: new Pickable(assets.ui.InfuserCursor),
							interactable: new Interactable(),
							showInteractable: true,
							infuser: true,
						})
					} else {
						for (const entity of infuserQuery) {
							ecs.addComponent(entity,'interactable',new Interactable())
							ecs.addComponent(entity, 'parent', box)
							ecs.addComponent(entity, 'position', new Vector2(47.5, -15))
						}
					}
				} else {
					for (const entity of infuserQuery) {
						ecs.removeComponent(entity, 'position')
						removeParent(entity)
					}
					for (const entity of teaBoxOpenedQuery) {
						ecs.remove(entity)
					}
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
