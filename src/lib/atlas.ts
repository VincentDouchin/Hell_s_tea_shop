import type { PixelTexture } from './pixelTexture'
import { Sprite } from './sprite'
import { ecs } from '@/global/init'

export class TextureAltas {
	index = 0
	constructor(public atlas: PixelTexture[]) {}
	get currentTexture() {
		return this.atlas[this.index]
	}
}
const atlasQuery = ecs.with('atlas', 'sprite')
const withoutSpriteQuery = ecs.with('atlas').without('sprite')

export const initializeAtlas = () => {
	return withoutSpriteQuery.onEntityAdded.subscribe((entity) => {
		ecs.addComponent(entity, 'sprite', new Sprite(entity.atlas.currentTexture))
	})
}

export const updateSpriteFromAtlas = () => {
	for (const { atlas, sprite } of atlasQuery) {
		if (atlas.currentTexture !== sprite.texture) {
			sprite.texture = atlas.currentTexture
		}
	}
}
