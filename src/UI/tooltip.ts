import type { Entity } from '@/global/init'
import { ecs } from '@/global/init'

export enum Tooltip {
	Temperature,
	Tea,
	Spice,
	Cup,
}

const getTooltipText = (tooltip: Tooltip, parent: Entity) => {
	switch (tooltip) {
		case Tooltip.Temperature:return `${parent.parent?.temperature?.temperature}°`
		case Tooltip.Tea:return parent.tea
		case Tooltip.Spice:return parent.spice
		case Tooltip.Cup:{
			const temp = parent.temperature ? `${parent.temperature.temperature}°` : null
			return [temp, ...(parent.spices ?? []), parent.tea].filter(Boolean).join(' - ') }
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
