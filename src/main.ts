import { render } from './global/rendering'
import { State } from './lib/state'
import { spawnCounter } from './makeTea/counter'

const core = new State()
	.onEnter()
	.onUpdate(render)
	.onExit()
	.enable()

const makeTea = new State()
	.onEnter(spawnCounter)

const animate = () => {
	State.update()
	requestAnimationFrame(animate)
}
animate()
