import { assets } from '@/global/init'

export enum Spice {
	ChilliPowder = 'Chilli powder',
	Marshmallows = 'Marshmallows',
	Nutmeg = 'Nutmeg',
	Suger = 'Suger',
	Thyme = 'Thyme',
	WhippedCream = 'Whipped Cream',
}
export const Spices = [
	{ name: Spice.ChilliPowder, sprite: assets.spices.ChilliPowder },
	{ name: Spice.Marshmallows, sprite: assets.spices.Marshmallow },
	{ name: Spice.Nutmeg, sprite: assets.spices.Nutmeg },
	{ name: Spice.Suger, sprite: assets.spices.Sugar },
	{ name: Spice.Thyme, sprite: assets.spices.Thyme },
	{ name: Spice.WhippedCream, sprite: assets.spices.WhippedCreamBottle },
] as const