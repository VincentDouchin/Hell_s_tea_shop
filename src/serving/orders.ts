import type { Tea } from '@/constants/tea'
import { ecs } from '@/global/init'

export class Order {
	constructor(public tea: Tea) {}
}
const bellQuery = ecs.with('bell', 'interactable')
const cupQuery = ecs.with('cup', 'tea', 'parent')
const orderQuery = ecs.with('order')
export const serveOrder = () => {
	for (const { interactable } of bellQuery) {
		if (interactable.justPressed) {
			for (const { tea, parent } of cupQuery) {
				if (parent.tray) {
					for (const customer of orderQuery) {
						if (customer.order.tea === tea) {
							ecs.removeComponent(customer, 'order')
						}
					}
				}
			}
		}
	}
}