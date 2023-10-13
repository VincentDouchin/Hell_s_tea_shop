import { addUiElements } from './UI/UiElement'
import { showTooltip } from './UI/tooltip'
import { addOrders, changeState, spawnKitchenUi, spawnServingUi } from './game/gameUI'
import { adjustScreenSize, initializeCameraBounds, moveCamera, setCameraZoom, spawnCamera } from './global/camera'
import { setRenderOrder } from './global/groups'
import { addChildren, despanwChildren } from './global/init'
import { detectInteractions, updateMousePosition } from './global/interactions'
import { updatePosition } from './global/position'
import { addShaders, addToScene } from './global/registerComponents'
import { initRendering, render } from './global/rendering'
import { removeCounter, spawnCounter as spawnKitchenCounter } from './kitchen/counter'
import { clickOnKettleButton, kettleGame, reduceTemperature, setTemperature } from './kitchen/kettle'
import { infuseTea, pickupItems, pickupTea, releaseItems, showPickupItems } from './kitchen/pickup'
import { changeCupContent, pourWater } from './kitchen/pour'
import { changeInfuserSprite, closeTeaBox, openTeabox } from './kitchen/teaBox'
import { initializeAtlas, updateSpriteFromAtlas } from './lib/atlas'
import { State } from './lib/state'
import { SystemSet } from './lib/systemset'
import { time } from './lib/time'
import { removeServinCounter, spawnServingCounter } from './serving/counter'
import { addedOutlineShader } from './shaders/OutlineShader'

// ! Core
new State()
	.addSubscribers(initializeCameraBounds, addChildren, despanwChildren, addedOutlineShader, ...addToScene(), ...addShaders(), initializeAtlas, addUiElements)
	.onEnter(initRendering, spawnCamera, updateMousePosition)
	.onUpdate(render, adjustScreenSize(), updatePosition, detectInteractions, updateSpriteFromAtlas, showTooltip, setRenderOrder)
	.onExit()
	.enable()

// ! Game State
new State()
	.addSubscribers(addOrders)
	.onEnter(spawnKitchenUi, spawnServingUi)
	.onUpdate(changeState, releaseItems, SystemSet(pickupItems).runIf(() => !kettleGame.active))
	.enable()

// ! Make Tea
export const kitchenState = new State()
	.addSubscribers()
	.onEnter(spawnKitchenCounter, setCameraZoom(3))
	.onUpdate(clickOnKettleButton, pickupTea, pourWater, openTeabox, infuseTea, changeCupContent, setTemperature, changeInfuserSprite, reduceTemperature, moveCamera(), showPickupItems)
	.onExit(removeCounter, closeTeaBox)
	.enable()

// ! Serve Customers
export const servingState = new State()
	.onEnter(spawnServingCounter)
	.onExit(removeServinCounter)
	.onUpdate()

const animate = (now: number) => {
	time.tick(now)
	State.update()
	requestAnimationFrame(animate)
}
animate(Date.now())
