import { ecs } from '@/global/init'

const tooltipQuery = ecs.with('tooltip', 'parent', 'uiElement')
export const showTooltip = () => {
	for (const { parent, uiElement } of tooltipQuery) {
		if (parent.interactable?.hover) {
			uiElement.text(`${parent.parent?.temperature?.temperature}°`)
			uiElement.setStyle('display', 'block')
		} else {
			uiElement.setStyle('display', 'none')
		}
	}
}
