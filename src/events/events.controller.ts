import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SlacksigGuard } from '../guards/slacksig.guard.js';
import type { EventContent, EventPayload, MentionEventPayload, UrlVerificationPayload } from '../types/Slack';
import { CallbackTypes, EventTypes } from './events.enum.js';
import { EventsService } from './events.service.js';
@Controller('events')
@UseGuards(SlacksigGuard)
export class EventsController {
	public constructor(private eventsService: EventsService) {}

	@HttpCode(200)
	@Post('/handle')
	public handleSlackEvent(@Body() body: EventPayload<EventContent> | UrlVerificationPayload) {
		switch (body.type) {
			case CallbackTypes.UrlVerification:
				return (body as UrlVerificationPayload).challenge;

			case CallbackTypes.EventCallback:
				switch (body.event.type) {
					case EventTypes.AppMention:
						void this.eventsService.handleMentionEvent(body as MentionEventPayload);
						break;
					default:
						break;
				}

				return 'OK!';
			default:
				return 'Unknown Event';
		}
	}
}
