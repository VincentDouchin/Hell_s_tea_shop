import { adjustScreenSize, initializeCameraBounds, spawnCamera } from './global/camera'
import { addChildren, despanwChildren } from './global/init'
import { detectInteractions, updateMousePosition } from './global/interactions'
import { updatePosition } from './global/position'
import { addShaders, addToScene } from './global/registerComponents'
import { initRendering, render } from './global/rendering'
import { initializeAtlas, updateSpriteFromAtlas } from './lib/atlas'
import { State } from './lib/state'
import { SystemSet } from './lib/systemset'
import { time } from './lib/time'
import { spawnCounter } from './makeTea/counter'
import { clickOnKettleButton, kettleGame, setTemperature } from './makeTea/kettle'
import { changeInfuserSprite, infuseTea, pickupItems, pickupTea, pikupTeaWithInfuser, releaseItems, showPickupItems, updatedPickedItemsPosition } from './makeTea/pickup'
import { changeCupContent, pourWater, tipKettle } from './makeTea/pour'
import { closeTeaBox, openTeabox } from './makeTea/teaBox'
import { addedOutlineShader } from './shaders/OutlineShader'

// ! Core
new State()
	.addSubscribers(initializeCameraBounds, addChildren, despanwChildren, addedOutlineShader, ...addToScene(), ...addShaders(), initializeAtlas)
	.onEnter(initRendering, spawnCamera, updateMousePosition)
	.onUpdate(render, adjustScreenSize(), updatePosition, detectInteractions, updateSpriteFromAtlas)
	.onExit()
	.enable()

// ! Make Tea
new State()
	.addSubscribers(changeInfuserSprite, pikupTeaWithInfuser, tipKettle)
	.onEnter(spawnCounter)
	.onUpdate(clickOnKettleButton, SystemSet(pickupItems).runIf(() => !kettleGame.active), releaseItems, showPickupItems, pickupTea, updatedPickedItemsPosition, pourWater, openTeabox, closeTeaBox, infuseTea, changeCupContent, setTemperature)
	.enable()

const animate = (now: number) => {
	time.tick(now)
	State.update()
	requestAnimationFrame(animate)
}
animate(Date.now())
