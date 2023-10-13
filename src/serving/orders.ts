import type { Teas } from '@/constants/tea'

export class Order {
	constructor(public tea: typeof Teas[number]) {}
}