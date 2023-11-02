import { assets, ecs } from '@/global/init'
import { PixelTexture } from '@/lib/pixelTexture'

export enum Liquid {
	Water,
	Tea,
}

const kettleQuery = ecs.with('kettle', 'picked', 'sprite', 'group')
const cupQuery = ecs.with('cup', 'position', 'sprite', 'interactable').without('filled')

export const pourWater = () => {
	for (const { temperature } of kettleQuery) {
		for (const cup of cupQuery) {
			if (cup.interactable.justPressed) {
				ecs.addComponent(cup, 'filled', Liquid.Water)
				ecs.addComponent(cup, 'temperature', temperature)
			}
		}
	}
}

const filledCupQuery = ecs.with('filled', 'sprite')

export const changeCupContent = () => {
	for (const { filled, sprite } of filledCupQuery) {
		const texture = {
			[Liquid.Water]: assets.sprites.CupWater,
			[Liquid.Tea]: assets.sprites.Cup,
		}[filled]
		if (sprite.composer.initialTarget.texture.image !== texture) {
			sprite.composer.setInitialTexture(new PixelTexture(texture))
		}
	}
}
