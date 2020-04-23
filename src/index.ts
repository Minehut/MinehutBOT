import { MinehutClient } from './client/minehutClient';
import { mongoose } from '@typegoose/typegoose';

require('dotenv').config();

// TODO: validate env variables
(async () => {
	const connection = await mongoose.connect(process.env.MONGO_URI || '', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	const client = new MinehutClient({
		ownerIds: process.env.OWNER_IDS?.split(' '),
		prefix: process.env.DISCORD_PREFIX || '!',
		mongo: connection,
	});
	client.login(process.env.DISCORD_TOKEN);
})();
