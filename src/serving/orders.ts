import type { Tea } from '@/constants/tea'
import { assets, ecs } from '@/global/init'
import { Slot, slotEntity } from '@/kitchen/pickup'
import { Sprite } from '@/lib/sprite'

export class Order {
	constructor(public tea: Tea) {}
}
const bellQuery = ecs.with('bell', 'interactable')
const cupQuery = ecs.with('cup', 'tea', 'parent', 'position')
const orderQuery = ecs.with('order')
export const serveOrder = () => {
	for (const { interactable } of bellQuery) {
		if (interactable.justPressed) {
			for (const cup of cupQuery) {
				const { tea, parent, position } = cup
				if (parent.tray) {
					for (const customer of orderQuery) {
						if (customer.order.tea === tea) {
							ecs.removeComponent(customer, 'order')
							ecs.add({
								...slotEntity(new Sprite(assets.sprites.CupEmpty), position.clone(), Slot.Cup, false),
								parent,
								renderOrder: 1,
							})
							ecs.remove(cup)
						}
					}
				}
			}
		}
	}
}