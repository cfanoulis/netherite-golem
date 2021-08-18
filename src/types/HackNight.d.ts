import type { DayOfWeek } from '../constants.js';

/**
 * Fun fact! Hack night actually runs until 23:59 that day, so we don't need to add ending times!
 */
export interface HackNight {
	day: DayOfWeek;
	hour: number;
	minute: number;
	title: string;
}
