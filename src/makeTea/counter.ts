import counterImage from '@assets/sprites/Cafe.png'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'

export const spawnCounter = () => {
	ecs.add({ sprite: new Sprite(assets.sprites.Cafe) })
}
