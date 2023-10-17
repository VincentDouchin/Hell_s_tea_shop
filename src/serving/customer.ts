import { Vector2 } from 'three'
import { Order } from './orders'
import { Teas } from '@/constants/tea'
import { assets, ecs } from '@/global/init'
import { Sprite } from '@/lib/sprite'

export const spawnOrder = () => {
	const tea = Teas[Math.floor(Math.random() * Teas.length)]

	ecs.add({
		renderOrder: -1,
		position: new Vector2(80, -50),
		customer: true,
		order: new Order(tea.name),
	})
}
const orderQuery = ecs.with('order')
export const showCustomer = () => {
	for (const entity of orderQuery) {
		ecs.addComponent(entity, 'sprite', new Sprite(assets.sprites.customer))
	}
}
export const hideCustomer = () => {
	for (const entity of orderQuery) {
		ecs.removeComponent(entity, 'sprite')
	}
}
