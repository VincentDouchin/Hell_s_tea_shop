import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'

export enum Liquid {
	Water,
	Tea,
}

const kettleQuery = ecs.with('kettle', 'picked', 'position', 'sprite')
const cupQuery = ecs.with('cup', 'position', 'sprite').without('filled')
kettleQuery.onEntityRemoved.subscribe(({ sprite }) => {
	sprite.rotation.z = 0
})
export const pourWater = () => {
	for (const kettle of kettleQuery.entities) {
		for (const cup of cupQuery.entities) {
			if (kettle.position.x < cup.position.x + 30 && kettle.position.x > cup.position.x - 30) {
				kettle.sprite.rotation.z = -Math.PI * 0.2
				ecs.removeComponent(cup, 'sprite')
				ecs.addComponent(cup, 'sprite', new Sprite(assets.sprites.CupWater))
				ecs.addComponent(cup, 'filled', Liquid.Water)
				console.log('ok')
			} else {
				kettle.sprite.rotation.z = -Math.PI * 0
			}
		}
	}
}
