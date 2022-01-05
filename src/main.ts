import { NestFactory } from '@nestjs/core';
import { WebClient } from '@slack/web-api';
import { config as readEnvVariables } from 'dotenv';
import type { Response } from 'express';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import type { RawBodyRequest } from './types/Express';

if (process.env.NODE_ENV === 'production') {
	process.once('SIGTERM', async () => {
		console.log('Oh, an update? Sure thing pal!');
		await new WebClient(process.env.TOKEN).chat.postMessage({
			channel: 'C016T0E6QHW',
			text: 'brb, I see an update coming, need to go fetch it'
		});
		process.exit(0);
	});
} else {
	readEnvVariables();
}

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
await new WebClient(process.env.TOKEN).chat.postMessage({ channel: 'C016T0E6QHW', text: "I'm a‎live! Missed me yet, <@USLACKBOT>?" });
