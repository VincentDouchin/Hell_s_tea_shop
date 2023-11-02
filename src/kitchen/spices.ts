import { Vector2 } from 'three'
import { Pickable } from './pickup'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'
import { Spices } from '@/constants/spices'
import { Interactable } from '@/global/interactions'
import { UIElement } from '@/UI/UiElement'
import { Tooltip } from '@/UI/tooltip'
import { PixelTexture } from '@/lib/pixelTexture'

const spiceShelfQuery = ecs.with('spiceShelf')
export const spawnSpiceShelf = () => {
	if (spiceShelfQuery.size === 0) {
		const shelf = ecs.add({
			spiceShelf: true,
			sprite: new Sprite(new PixelTexture(assets.sprites.shelf)),
			position: new Vector2(0, -20),
		})
		const rows = [0, 0]
		for (const spice of Spices) {
			const row = spice.sprite.height === 32 ? 0 : 1
			const y = (row * 32) + 16 - assets.sprites.shelf.height / 2 + spice.sprite.height / 2
			const x = -assets.sprites.shelf.width / 2 + spice.sprite.width / 2 + rows[row]
			rows[row] += spice.sprite.width
			const spriceEntity = ecs.add({
				sprite: new Sprite(new PixelTexture(spice.sprite)),
				position: new Vector2(x, y),
				parent: shelf,
				interactable: new Interactable(),
				showInteractable: true,
				spice: spice.name,
				pickable: new Pickable(spice.name, spice.sprite),
			})
			ecs.add({
				...new UIElement({ display: 'none' }).ninceSlice(assets.ui.frameSimple, 3).withWorldPosition(0, 10),
				tooltip: Tooltip.Spice,
				parent: spriceEntity,
			})
		}
	}
}
const pickedSpiceQuery = ecs.with('picked', 'spice')
const cupQuery = ecs.with('cup', 'interactable')
export const addSpices = () => {
	for (const { spice } of pickedSpiceQuery) {
		for (const cupEntity of cupQuery) {
			const { interactable, spices } = cupEntity
			if (interactable.justPressed) {
				if (!spices?.includes(spice)) {
					if (spices) {
						spices.push(spice)
					} else {
						ecs.addComponent(cupEntity, 'spices', [spice])
					}
				}
			}
		}
	}
}