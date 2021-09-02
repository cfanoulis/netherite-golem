import { NestFactory } from '@nestjs/core';
import { WebClient } from '@slack/web-api';
import { config as readEnvVariables } from 'dotenv';
import type { Response } from 'express';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import type { RawBodyRequest } from './types/Express';
if (process.env.NODE_ENV !== 'prodcution') readEnvVariables();

const app = await NestFactory.create(AppModule, {
	bodyParser: false
});

app.use(helmet());

// Add raw body, for Slack sig verification
const rawBodyBuffer = (req: RawBodyRequest, _res: Response, buf: Buffer, encoding: BufferEncoding) => {
	if (buf && buf.length) {
		req.rawBody = buf.toString(encoding || 'utf8');
	}
};
app.use(urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(json({ verify: rawBodyBuffer }));

await app.listen(process.env.PORT ?? 3000);
await new WebClient(process.env.TOKEN).chat.postMessage({ channel: 'C0P5NE354', text: "I'm alive! Missed me yet, <@U015D6A36AG>?" });
