import { Injectable, UseGuards } from '@nestjs/common';
import { SlacksigGuard } from './guards/slacksig.guard.js';

@Injectable()
export class AppService {
	@UseGuards(SlacksigGuard)
	public getHello(): string {
		return 'Are you meant to be here? No of course! Get back on the slack!';
	}
}
