import type { Request } from 'express';

export interface RawBodyRequest extends Request {
	rawBody: string;
}
