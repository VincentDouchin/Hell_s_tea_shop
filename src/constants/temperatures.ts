export interface Temperature {
	check: (t: number) => boolean
	name: string
}
export const temperatures: Temperature[] = [
	{
		check: (t: number) => t < 30,
		name: 'cold 0 - 30',
	},
	{
		check: (t: number) => t > 30 && t < 50,
		name: 'warm 30 - 50',
	},
	{
		check: (t: number) => t > 50 && t < 80,
		name: 'hot 50 - 80',
	},
	{
		check: (t: number) => t > 80 && t < 100,
		name: 'boiling 80 - 100',
	},
]