import { Vector2 } from 'three'
import { Pickable, Slot } from './pickup'
import { Teas } from '@/constants/tea'
import { cameraQuery } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'

const teaBoxOpenedQuery = ecs.with('teaBoxOpened', 'interactable')
const teaBoxVisibleQuery = teaBoxOpenedQuery.with('position')
const teaBoxQuery = ecs.with('teaBox', 'interactable')
export const closeTeaBox = () => {
	for (const entity of teaBoxVisibleQuery) {
		ecs.removeComponent(entity, 'position')
	}
}
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
						renderOrder: 2,
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
					ecs.add({
						parent: box,
						sprite: new Sprite(assets.sprites.InfuserBox).setRenderOrder(teaScale),
						position: new Vector2(47.5, -16),
						pickable: new Pickable(Slot.Infuser, assets.ui.InfuserCursor),
						interactable: new Interactable(),
						showInteractable: true,
						infuser: true,
					})
				} else {
					if (teaBoxVisibleQuery.size) {
						closeTeaBox()
					} else {
						for (const entity of teaBoxOpenedQuery) {
							ecs.addComponent(entity, 'position', cameraPosition)
						}
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
