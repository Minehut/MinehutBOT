import { MinehutClient } from './client/minehutClient';

require('dotenv').config();

// TODO: validate env variables
const client = new MinehutClient({
	ownerIds: process.env.OWNER_IDS?.split(' '),
	prefix: process.env.DISCORD_PREFIX || '!',
	databaseUri: process.env.MONGO_URI,
});
client.login(process.env.DISCORD_TOKEN);
