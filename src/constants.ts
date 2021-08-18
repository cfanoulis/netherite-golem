import type { HackNight } from './types/HackNight.js';

export const enum DayOfWeek {
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6,
	Sunday = 7
}

export const HACK_NIGHT_SCHEDULE: HackNight[] = [
	{
		day: DayOfWeek.Wednesday,
		hour: 19,
		minute: 30,
		title: 'Hack Night (EU)'
	},
	{
		day: DayOfWeek.Sunday,
		hour: 0,
		minute: 30,
		title: 'Hack Night (US)'
	}
];
