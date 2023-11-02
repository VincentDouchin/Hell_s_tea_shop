import { Vector2 } from 'three'
import { Pickable, Slot } from './pickup'
import { Teas } from '@/constants/tea'
import { cameraQuery } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'
import { Tooltip } from '@/UI/tooltip'
import { UIElement } from '@/UI/UiElement'
import { PixelTexture } from '@/lib/pixelTexture'

const teaBoxOpenedQuery = ecs.with('teaBoxOpened', 'interactable')
const teaBoxVisibleQuery = teaBoxOpenedQuery.with('position')
const teaBoxQuery = ecs.with('teaBox', 'interactable')

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
						renderOrder: 3,
						sprite: new Sprite(assets.sprites.TeaBox).setScale(teaScale),
						position: cameraPosition,
						interactable: new Interactable(),
						teaBoxOpened: true,
					})
					for (let x = 0; x < 3; x++) {
						for (let y = 0; y < 3; y++) {
							const tea = Teas[x * 3 + y]
							const teaEntity = ecs.add({
								parent: box,
								sprite: new Sprite(tea.image).setScale(teaScale),
								interactable: new Interactable(),
								showInteractable: true,
								position: new Vector2(xPositions[x], yPositions[y]),
								tea: tea.name,
							})
							ecs.add({
								...new UIElement({ display: 'none' }).ninceSlice(assets.ui.frameSimple, 3).withWorldPosition(0, 10),
								tooltip: Tooltip.Tea,
								parent: teaEntity,
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
						for (const entity of teaBoxVisibleQuery) {
							ecs.removeComponent(entity, 'position')
						}
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
