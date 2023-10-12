import { showTooltip } from './UI/tooltip'
import { adjustScreenSize, initializeCameraBounds, moveCamera, setCameraZoom, spawnCamera } from './global/camera'
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
import { clickOnKettleButton, kettleGame, reduceTemperature, setTemperature } from './makeTea/kettle'
import { infuseTea, pickupItems, pickupTea, releaseItems, showPickedItems, showPickupItems } from './makeTea/pickup'
import { changeCupContent, pourWater } from './makeTea/pour'
import { changeInfuserSprite, openTeabox } from './makeTea/teaBox'
import { addedOutlineShader } from './shaders/OutlineShader'

// ! Core
new State()
	.addSubscribers(initializeCameraBounds, addChildren, despanwChildren, addedOutlineShader, ...addToScene(), ...addShaders(), initializeAtlas)
	.onEnter(initRendering, spawnCamera, updateMousePosition)
	.onUpdate(render, adjustScreenSize(), updatePosition, detectInteractions, updateSpriteFromAtlas, showTooltip)
	.onExit()
	.enable()

// ! Make Tea
new State()
	.addSubscribers()
	.onEnter(spawnCounter, setCameraZoom(3))
	.onUpdate(clickOnKettleButton, showPickupItems, pickupTea, pourWater, openTeabox, infuseTea, changeCupContent, setTemperature, showPickedItems, SystemSet(pickupItems).runIf(() => !kettleGame.active), releaseItems, changeInfuserSprite, reduceTemperature, moveCamera())
	.enable()

const animate = (now: number) => {
	time.tick(now)
	State.update()
	requestAnimationFrame(animate)
}
animate(Date.now())
