import { Injectable, UseGuards } from '@nestjs/common';
import { EASTER_EGG } from './constants.js';
import { SlacksigGuard } from './guards/slacksig.guard.js';

@Injectable()
export class AppService {
	@UseGuards(SlacksigGuard)
	public getRootResponse(): string {
		return EASTER_EGG;
	}
}
