import { assets, ecs } from '@/global/init'

export enum Liquid {
	Water,
	Tea,
}

const kettleQuery = ecs.with('kettle', 'picked', 'position', 'sprite', 'group')
const cupQuery = ecs.with('cup', 'position', 'sprite', 'interactable').without('filled')

export const pourWater = () => {
	if (kettleQuery.size) {
		for (const cup of cupQuery) {
			if (cup.interactable.justPressed) {
				ecs.addComponent(cup, 'filled', Liquid.Water)
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
		if (sprite.composer.initialTarget.texture !== texture) {
			sprite.composer.setInitialTexture(texture)
		}
	}
}
