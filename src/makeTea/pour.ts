import { assets, ecs } from '@/global/init'

export enum Liquid {
	Water,
	Tea,
}

const kettleQuery = ecs.with('kettle', 'picked', 'position', 'sprite', 'group')
const cupQuery = ecs.with('cup', 'position', 'sprite').without('filled')
export const tipKettle = () => kettleQuery.onEntityRemoved.subscribe(({ group }) => {
	group.rotation.z = 0
})
export const pourWater = () => {
	for (const kettle of kettleQuery) {
		for (const cup of cupQuery) {
			if (kettle.position.x < cup.position.x + 30 && kettle.position.x > cup.position.x - 30) {
				kettle.group.rotation.z = -Math.PI * 0.2
				ecs.addComponent(cup, 'filled', Liquid.Water)
			} else {
				kettle.group.rotation.z = -Math.PI * 0
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
