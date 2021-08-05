import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SlacksigGuard } from '../guards/slacksig.guard.js';

@Controller('events')
@UseGuards(SlacksigGuard)
export class EventsController {
	@HttpCode(200)
	@Post('/handle')
	public handleSlackEvent(@Body() body: Record<string, unknown>) {
		switch (body.type) {
			case 'url_verification':
				return body.challenge;

			default:
				return 'Unknown Event';
		}
	}
}
