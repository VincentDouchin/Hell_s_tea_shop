import { Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, RepeatWrapping, type Texture } from 'three'

export class Background extends Mesh<PlaneGeometry, MeshBasicMaterial> {
	constructor(texture: Texture) {
		texture.repeat.x = window.innerWidth / texture.image.width
		texture.repeat.y = window.innerHeight / texture.image.height
		texture.wrapS = RepeatWrapping
		texture.wrapT = RepeatWrapping
		texture.magFilter = NearestFilter
		super(new PlaneGeometry(window.innerWidth, window.innerHeight), new MeshBasicMaterial({ map: texture }))
	}
}