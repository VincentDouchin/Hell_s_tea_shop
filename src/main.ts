import { adjustScreenSize, initializeCameraBounds, spawnCamera } from './global/camera'
import { detectInteractions, updateMousePosition } from './global/interactions'
import { updatePosition } from './global/position'
import { addShaders, addToScene } from './global/registerComponents'
import { initRendering, render } from './global/rendering'
import { State } from './lib/state'
import { spawnCounter } from './makeTea/counter'
import { pickupItems, releaseItems, showPickupItems, updatedPickedItemsPosition } from './makeTea/pickup'
import { pourWater } from './makeTea/pour'
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
	.onUpdate(showPickupItems, pickupItems, updatedPickedItemsPosition, releaseItems, pourWater)
	.enable()

const animate = () => {
	State.update()
	requestAnimationFrame(animate)
}
animate()
