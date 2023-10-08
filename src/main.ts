import { adjustScreenSize, initializeCameraBounds, spawnCamera } from './global/camera'
import { detectInteractions, updateMousePosition } from './global/interactions'
import { updatePosition } from './global/position'
import { addShaders, addToScene } from './global/registerComponents'
import { initRendering, render } from './global/rendering'
import { State } from './lib/state'
import { spawnCounter } from './makeTea/counter'
import { infuseTea, pickupItems, pickupTea, releaseItems, showPickupItems, updatedPickedItemsPosition } from './makeTea/pickup'
import { changeCupContent, pourWater } from './makeTea/pour'
import { openTeabox } from './makeTea/teaBox'
import { addedOutlineShader } from './shaders/OutlineShader'

addToScene()
// ! Core
new State()
	.onEnter(initRendering, spawnCamera, initializeCameraBounds, updateMousePosition, addedOutlineShader, addShaders)
	.onUpdate(render, adjustScreenSize(), updatePosition, detectInteractions)
	.onExit()
	.enable()

// ! Make Tea
new State()
	.onEnter(spawnCounter)
	.onUpdate(showPickupItems, pickupTea, pickupItems, releaseItems, updatedPickedItemsPosition, pourWater, openTeabox, infuseTea, changeCupContent)
	.enable()

const animate = () => {
	State.update()
	requestAnimationFrame(animate)
}
animate()
