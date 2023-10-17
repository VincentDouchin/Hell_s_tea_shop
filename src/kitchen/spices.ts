import { Vector2 } from 'three'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'
import { Spices } from '@/constants/spices'
import { Interactable } from '@/global/interactions'

const spiceShelfQuery = ecs.with('spiceShelf')
export const spawnSpiceShelf = () => {
	if (spiceShelfQuery.size === 0) {
		const shelf = ecs.add({
			spiceShelf: true,
			sprite: new Sprite(assets.sprites.shelf),
			position: new Vector2(0, -20),
		})
		const rows = [0, 0]
		for (const spice of Spices) {
			const row = spice.sprite.image.height === 32 ? 0 : 1
			const y = (row * 32) + 16 - assets.sprites.shelf.image.height / 2 + spice.sprite.image.height / 2
			const x = -assets.sprites.shelf.image.width / 2 + spice.sprite.image.width / 2 + rows[row]
			rows[row] += spice.sprite.image.width
			ecs.add({
				sprite: new Sprite(spice.sprite),
				position: new Vector2(x, y),
				parent: shelf,
				interactable: new Interactable(),
				showInteractable: true,
			})
		}
	}
}