import { MinehutClient } from './client/MinehutClient';

require('dotenv').config();

// TODO: validate env variables
const client = new MinehutClient({
  ownerIds: process.env.OWNER_IDS?.split(' '),
  prefix: process.env.DISCORD_PREFIX || '!'
});
client.login(process.env.DISCORD_TOKEN);
