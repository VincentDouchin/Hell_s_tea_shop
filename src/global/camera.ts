import { OrthographicCamera } from 'three'

const createCamera = () => {
	const width = window.innerWidth
	const height = window.innerHeight

	return new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
}

export const camera = createCamera()
