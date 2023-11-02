import { Vector2 } from 'three'
import { kettle } from './kettle'
import { Pickable, Slot } from './pickup'
import { CameraBounds } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { Sprite } from '@/lib/sprite'
import { UIElement } from '@/UI/UiElement'
import { Tooltip } from '@/UI/tooltip'
import { PixelTexture } from '@/lib/pixelTexture'

const counterQuery = ecs.with('counter')
export const spawnCounter = () => {
	if (counterQuery.size) {
		for (const entity of counterQuery) {
			ecs.addComponent(entity, 'position', new Vector2())
		}
	} else {
		// ! Counter
		const counter = ecs.add({
			counter: true,
			sprite: new Sprite(new PixelTexture(assets.sprites.Cafe)),
			anchor: { bottom: true },
			cameraBounds: new CameraBounds(),
			position: new Vector2(),
		})
		// ! Teabox
		ecs.add({
			sprite: new Sprite(new PixelTexture(assets.sprites.TeaBoxOver)),
			position: new Vector2(150, -95),
			parent: counter,
			interactable: new Interactable(),
			showInteractable: true,
			teaBox: true,
		})
		// ! Cup
		const cup = ecs.add({
			sprite: new Sprite(new PixelTexture(assets.sprites.CupEmpty)).setRenderOrder(2),
			position: new Vector2(0, -95),
			parent: counter,
			interactable: new Interactable(),
			showInteractable: true,
			cup: { touchedByInfuser: 0 },
			pickable: new Pickable(Slot.Cup, assets.ui.CupEmpty),
		})
		ecs.add({
			...new UIElement({ display: 'none' }).ninceSlice(assets.ui.frameSimple, 3).withWorldPosition(0, 10),
			tooltip: Tooltip.Cup,
			parent: cup,
		})

		kettle(counter)
	}
}
