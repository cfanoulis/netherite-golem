import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import type { RawBodyRequest } from '../types/Express';

@Injectable()
export class SlacksigGuard implements CanActivate {
	public canActivate(context: ExecutionContext) {
		// If we don't have a signing secret, don't bother checking
		if (typeof process.env.SIGNING_SECRET === 'undefined') return true;

		// Extract data required for sig verification
		const { headers, rawBody } = context.switchToHttp().getRequest<RawBodyRequest>();
		const timestamp = headers['x-slack-request-timestamp'] as string;
		const [version, providedSig] = (headers['x-slack-signature'] as string).split('=');

		// Check if we're provided a proper timestamp
		const parsedTimestamp = parseInt(timestamp, 10);
		if (isNaN(parsedTimestamp)) return false;

		// Replay attack prevention.
		const fiveMinutesAgo = Date.now() / 1000 - 60 * 5;
		if (parsedTimestamp < fiveMinutesAgo) return false;

		// Calculate & compare signature
		const calculatedSig = createHmac('sha256', process.env.SIGNING_SECRET! as string)
			.update(`${version}:${timestamp}:${rawBody}`)
			.digest('hex');

		return timingSafeEqual(Buffer.from(providedSig), Buffer.from(calculatedSig));
	}
}
