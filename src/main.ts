import { addUiElements, removeUiElements } from './UI/UiElement'
import { showTooltip } from './UI/tooltip'
import { addOrders, changeState, removeOrders, spawnKitchenUi, spawnServingUi } from './game/gameUI'
import { adjustScreenSize, initializeCameraBounds, moveCamera, setCameraZoom, spawnCamera } from './global/camera'
import { setRenderOrder } from './global/groups'
import { addChildren, despanwChildren, kitchenState, servingState } from './global/init'
import { detectInteractions, updateMousePosition } from './global/interactions'
import { updatePosition } from './global/position'
import { addShaders, addToScene } from './global/registerComponents'
import { initRendering, kitchenScene, render, servingScene, setCurrentScene, spawnBackground } from './global/rendering'
import { spawnCounter as spawnKitchenCounter } from './kitchen/counter'
import { clickOnKettleButton, kettleGame, reduceTemperature, setTemperature } from './kitchen/kettle'
import { infuseTea, pickupItems, pickupTea, releaseItems, showPickupItems } from './kitchen/pickup'
import { changeCupContent, pourWater } from './kitchen/pour'
import { spawnSpiceShelf } from './kitchen/spices'
import { changeInfuserSprite, openTeabox } from './kitchen/teaBox'
import { initializeAtlas, updateSpriteFromAtlas } from './lib/atlas'
import { State } from './lib/state'
import { SystemSet } from './lib/systemset'
import { time } from './lib/time'
import { spawnServingCounter } from './serving/counter'
import { hideCustomer, showCustomer, spawnOrder } from './serving/customer'
import { serveOrder } from './serving/orders'
import { addedOutlineShader } from './shaders/OutlineShader'

// ! Core
new State()
	.addSubscribers(initializeCameraBounds, addChildren, despanwChildren, addedOutlineShader, ...addToScene(), ...addShaders(), initializeAtlas, addUiElements, removeUiElements)
	.onEnter(initRendering, spawnCamera, updateMousePosition)
	.onUpdate(render, adjustScreenSize(), updatePosition, detectInteractions, updateSpriteFromAtlas, showTooltip, setRenderOrder, showPickupItems)
	.onExit()
	.enable()

// ! Game State
new State()
	.addSubscribers(addOrders, removeOrders)
	.onEnter(spawnKitchenUi, spawnServingUi, spawnOrder)
	.onUpdate(changeState, releaseItems, SystemSet(pickupItems).runIf(() => !kettleGame.active))
	.enable()

// ! Make Tea
kitchenState
	.addSubscribers()
	.onEnter(setCurrentScene(kitchenScene), spawnBackground, spawnKitchenCounter, setCameraZoom(3), spawnSpiceShelf)
	.onUpdate(clickOnKettleButton, pickupTea, pourWater, openTeabox, infuseTea, changeCupContent, setTemperature, changeInfuserSprite, reduceTemperature, moveCamera())
	.onExit()
	.enable()

// ! Serve Customers
servingState
	.onEnter(setCurrentScene(servingScene), spawnServingCounter, spawnBackground, showCustomer)
	.onUpdate(serveOrder)
	.onExit(hideCustomer)
	.onUpdate()

const animate = (now: number) => {
	time.tick(now)
	State.update()
	requestAnimationFrame(animate)
}
animate(Date.now())
