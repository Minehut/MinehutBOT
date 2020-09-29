import { MinehutClient } from './client/minehutClient';
import { mongoose } from '@typegoose/typegoose';
import * as Sentry from '@sentry/node';

require('dotenv').config();

if (process.env.NODE_ENV === 'production')
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
	});

// TODO: validate env variables
(async () => {
	const connection = await mongoose.connect(process.env.MONGO_URI || '', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	const client = new MinehutClient({
		ownerIds: process.env.OWNER_IDS?.split(','),
		prefix: process.env.DISCORD_PREFIX || '!',
		mongo: connection,
	});

	await client.start(process.env.DISCORD_TOKEN!);
})();