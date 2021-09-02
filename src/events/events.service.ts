import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import type { MentionEventPayload } from '../types/Slack';
import { TimeUtils } from '../utils/timeUtils.js';

/**
 * Licensed under the MIT. Sourced from https://github.com/lukec11/Night-Golem
 * Includes 2 capture groups - [0] is the whole phrase, [1] is the dynamic part (which needs to be censored, occasionally)
 */
export const hackNightRegex =
	/next ((?:s?hr?|cr|u|o)(?:e|a|i|o|u)?c?o?w?(?:k|c|p|t|oo?|u(?:t|p)?)(?:e|a)?(?:s|y|lacka)?(?:\s|-)?(?:n|b)?(?:e|i|oo?|a)?u?(?:k|w|g|c|o|t)?k?a?(?:ey|ht|ky|e|t|wu|o(?:p|t)?|lacka))/i;

// I hate every single item on this list
const bannedCombos = ['hot nut', 'shrek nut', 'hickey nut', 'crap nut', 'hoe nut', 'hot butt', 'hot nutt', 'hoe nutt', 'shitt', 'shit night'];

@Injectable()
export class EventsService {
	private slackClient = new WebClient(process.env.TOKEN);
	public async handleMessage(body: MentionEventPayload) {
		const regexResult = body.event.text.match(hackNightRegex);
		if (regexResult === null || bannedCombos.includes(regexResult[1])) return;

		// If there's a Hack Night running, tell them to join!
		if (TimeUtils.isHackNightRunning()) {
			const { title } = TimeUtils.getNextHackNight();

			return this.slackClient.chat.postMessage({
				channel: body.event.channel,
				thread_ts: body.event.ts,
				text: `*${title}* is happening right now! <https://hack.af/night|Join the call!>`
			});
		}
		const { title, date } = TimeUtils.getNextHackNight();
		return this.slackClient.chat.postMessage({
			channel: body.event.channel,
			thread_ts: body.event.ts,
			text: `The next ${regexResult[1]} is *${title}*, on *<!date^${(date.getTime() / 1000).toFixed(
				0
			)}^{date_short_pretty} at {time}|[Open Slack To View]>* your time. See you there!`
		});
	}
}
