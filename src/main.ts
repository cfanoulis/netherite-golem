import { NestFactory } from '@nestjs/core';
import { config as readEnvVariables } from 'dotenv';
import type { Response } from 'express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module.js';
import type { RawBodyRequest } from './types/Express';

readEnvVariables();

const app = await NestFactory.create(AppModule, {
	bodyParser: false
});

/*
 * Add raw body property
 */
const rawBodyBuffer = (req: RawBodyRequest, _res: Response, buf: Buffer, encoding: BufferEncoding) => {
	if (buf && buf.length) {
		req.rawBody = buf.toString(encoding || 'utf8');
	}
};
app.use(urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(json({ verify: rawBodyBuffer }));

await app.listen(process.env.PORT ?? 3000);
