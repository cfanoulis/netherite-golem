import { DayOfWeek, HACK_NIGHT_SCHEDULE } from '../constants.js';
import type { HackNight } from '../types/HackNight.js';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TimeUtils {
	private constructor() {
		throw new Error("Don't instantiate me!");
	}

	public static isHackNightRunning() {
		const now = new Date();

		const possibleCurrentHackNightIndex = HACK_NIGHT_SCHEDULE.findIndex((hn) => now.getUTCDay() === hn.day);
		if (possibleCurrentHackNightIndex === -1) return false;
		console.log('o it shack night day!');

		const { hour, minute } = HACK_NIGHT_SCHEDULE[possibleCurrentHackNightIndex];
		const hackNightStartTime = new Date();
		hackNightStartTime.setHours(hour, minute, 0, 0);

		console.log('now: %d, hacknight: %d', now, hackNightStartTime);
		return now.getTime() > hackNightStartTime.getTime();
	}

	public static getNextHackNight() {
		const now = new Date();
		const today = now.getDay() as DayOfWeek;

		// Is hack night today?
		const possibleCurrentHackNightIndex = HACK_NIGHT_SCHEDULE.findIndex((hn) => today === hn.day);
		if (possibleCurrentHackNightIndex !== -1)
			return {
				date: TimeUtils.dateFromHackNightData(HACK_NIGHT_SCHEDULE[possibleCurrentHackNightIndex], now, true),
				title: HACK_NIGHT_SCHEDULE[possibleCurrentHackNightIndex].title
			};

		// Find the closest Hack night
		const hackNightDistances = HACK_NIGHT_SCHEDULE.map((val, idx) => [val.day - today, idx])
			.filter(([val]) => val > 0)
			.sort(([val1], [val2]) => val1 - val2);

		return {
			date: TimeUtils.dateFromHackNightData(HACK_NIGHT_SCHEDULE[hackNightDistances[0][1]], now, false),
			title: HACK_NIGHT_SCHEDULE[hackNightDistances[0][1]].title
		};
	}

	public static dateFromHackNightData(d: HackNight, now: Date, today: boolean) {
		const hackNightDate = new Date();

		if (!today) {
			const daysToAdd = d.day - now.getDay();
			const todaysDate = now.getDate();
			// This will wrap around to next month if required: see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCDate#description
			hackNightDate.setUTCDate(todaysDate + daysToAdd);
		}

		hackNightDate.setHours(d.hour, d.minute, 0, 0);
		return hackNightDate;
	}
}
