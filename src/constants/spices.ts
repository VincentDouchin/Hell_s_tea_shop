import { assets } from '@/global/init'

export enum Spice {
	ChilliPowder = 'Chilli powder',
	Cinnamon = 'Cinnamon',
	Marshmallows = 'Marshmallows',
	Nutmeg = 'Nutmeg',
	Sugar = 'Sugar',
	Thyme = 'Thyme',
	WhippedCream = 'Whipped Cream',
}
export const Spices = [
	{ name: Spice.ChilliPowder, sprite: assets.spices.ChilliPowder },
	{ name: Spice.Cinnamon, sprite: assets.spices.Cinnamon },
	{ name: Spice.Marshmallows, sprite: assets.spices.Marshmallow },
	{ name: Spice.Nutmeg, sprite: assets.spices.Nutmeg },
	{ name: Spice.Sugar, sprite: assets.spices.Sugar },
	{ name: Spice.Thyme, sprite: assets.spices.Thyme },
	{ name: Spice.WhippedCream, sprite: assets.spices.WhippedCreamBottle },
]