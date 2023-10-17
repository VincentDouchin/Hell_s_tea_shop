import { assets } from '@/global/init'

export enum Tea {
	Camomille = 'Camomille',
	DriedBitterMelon = 'DriedBitterMelon',
	DriedBluePea = 'DriedBluePea',
	EarlGray = 'EarlGray',
	Hibiscus = 'Hibiscus',
	Lavender = 'Lavender',
	Mint = 'Mint',
	Rose = 'Rose',
	Strawberry = 'Strawberry',
}

export const Teas = [
	{ name: Tea.Camomille, image: assets.tea.CammomileTea },
	{ name: Tea.DriedBitterMelon, image: assets.tea.DriedBitterMelon },
	{ name: Tea.DriedBluePea, image: assets.tea.DriedBluePea },
	{ name: Tea.EarlGray, image: assets.tea.EarlGray },
	{ name: Tea.Hibiscus, image: assets.tea.HibiscusTea },
	{ name: Tea.Lavender, image: assets.tea.Lavender },
	{ name: Tea.Mint, image: assets.tea.Mint },
	{ name: Tea.Rose, image: assets.tea.RoseTea },
	{ name: Tea.Strawberry, image: assets.tea.StrawberryGreenTea },

]