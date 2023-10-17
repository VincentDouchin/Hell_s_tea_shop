import type { Entity } from '@/global/init'
import { ecs } from '@/global/init'

export enum Tooltip {
	Temperature,
	Tea,
}

const getTooltipText = (tooltip: Tooltip, parent: Entity) => {
	switch (tooltip) {
		case Tooltip.Temperature:return `${parent.parent?.temperature?.temperature}°`
		case Tooltip.Tea:return parent.tea
	}
}

const tooltipQuery = ecs.with('tooltip', 'parent', 'uiElement')
export const showTooltip = () => {
	for (const { tooltip, parent, uiElement } of tooltipQuery) {
		const text = getTooltipText(tooltip, parent)
		if (parent.interactable?.hover && text) {
			uiElement.text(`${text}`)
			uiElement.setStyle('display', 'block')
		} else {
			uiElement.setStyle('display', 'none')
		}
	}
}
