import { Vector2 } from 'three'
import { Order } from './orders'
import { Teas } from '@/constants/tea'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'
import { Tween } from '@/utils/tween'
import { temperatures } from '@/constants/temperatures'
import { PixelTexture } from '@/lib/pixelTexture'
import { getRandom } from '@/utils/mapFunctions'
import type { Spice } from '@/constants/spices'
import { Spices } from '@/constants/spices'

export const spawnOrder = () => {
	const tea = getRandom(Teas)
	const temperature = getRandom(temperatures)
	const spices: Spice[] = []
	if (Math.random() < 0.3) {
		spices.push(getRandom(Spices).name)
	}
	if (Math.random() < 0.3) {
		spices.push(getRandom(Spices.filter(s => !spices.includes(s.name))).name)
	}

	ecs.add({
		renderOrder: -1,
		position: new Vector2(80, -50),
		customer: true,
		order: new Order(tea.name, temperature, spices),
	})
}
const orderQuery = ecs.with('order')
export const showCustomer = () => {
	for (const entity of orderQuery) {
		ecs.addComponent(entity, 'sprite', new Sprite(new PixelTexture(assets.sprites.customer)))
	}
}
export const hideCustomer = () => {
	for (const entity of orderQuery) {
		ecs.removeComponent(entity, 'sprite')
	}
}

const customerQuery = ecs.with('customer', 'order', 'position', 'group')

export const customerLeave = () => customerQuery.onEntityRemoved.subscribe((customer) => {
	new Tween(3000)
		.onUpdate(x => customer.position.x = x, customer.position.x, -500)
		.onUpdate(r => customer.group.rotation.z = Math.sin(r * 20) / 5)
})