import { UIElement, UiTag, UiTagQuery } from '@/UI/UiElement'
import { assets, ecs, kitchenState, servingState } from '@/global/init'
import { Interactable } from '@/global/interactions'
import { sleep } from '@/utils/sleep'

export const spawnKitchenUi = () => {
	ecs.add({
		uiElement: new UIElement().setImage(assets.ui.switchButton, 3),
		uiTag: UiTag.SwitchButton,
		interactable: new Interactable(),
	})
}
const switchButtonQuery = UiTagQuery(UiTag.SwitchButton)
export const changeState = () => {
	for (const { interactable } of switchButtonQuery) {
		if (interactable?.justReleased) {
			if (kitchenState.active) {
				kitchenState.disable()
				servingState.enable()
			} else {
				sleep(100).then(() => {
					kitchenState.enable()
					servingState.disable()
				})
			}
		}
	}
}

export const spawnServingUi = () => {
	ecs.add({
		uiElement: new UIElement().ninceSlice(assets.ui.frameSimple, 3, 3).setStyles({ width: '20vw', height: '10vw', position: 'fixed', top: '2vw', right: '2vw' }),
		orderContainer: true,
	})
}
const ordersQuery = ecs.with('order')
const orderContainerQuery = ecs.with('orderContainer')

export const addOrders = () => ordersQuery.onEntityAdded.subscribe((customer) => {
	for (const orderContainer of orderContainerQuery) {
		ecs.add({
			parent: orderContainer,
			uiElement: new UIElement().text(customer.order.tea),
			uiLink: customer,
		})
	}
})
const orderDisplayedQuery = ecs.with('uiLink')
export const removeOrders = () => ordersQuery.onEntityRemoved.subscribe((customer) => {
	for (const orderDisplayed of orderDisplayedQuery) {
		if (orderDisplayed.uiLink === customer) {
			ecs.remove(orderDisplayed)
		}
	}
})