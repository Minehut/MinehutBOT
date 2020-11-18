import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';

interface RawPacket {
	t: string;
	d: any;
	s: number;
	op: number;
}

export default class ReactionRawListener extends Listener {
	constructor() {
		super('reactionRaw', {
			emitter: 'client',
			event: 'raw',
		});
	}

	async exec(packet: RawPacket) {
		if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
			return;

		const channel = this.client.channels.cache.get(
			packet.d.channel_id
		) as TextChannel;
		if (!channel || channel.messages.cache.has(packet.d.message_id)) return; // if message is already cached don't emit again

		const message = await channel.messages.fetch(packet.d.message_id);
		if (!message)
			throw new Error('Could not fetch message in reaction role raw');

		const emoji = packet.d.emoji.id
			? `${packet.d.emoji.name}:${packet.d.emoji.id}`
			: packet.d.emoji.name;

		const reaction = message.reactions.cache.get(emoji);
		if (!reaction) return;

		reaction.users.cache.set(
			packet.d.user_id,
			this.client.users.resolve(packet.d.user_id)!
		);

		switch (packet.t) {
			case 'MESSAGE_REACTION_ADD':
				return this.client.emit(
					'messageReactionAdd',
					reaction!,
					this.client.users.resolve(packet.d.user_id)!
				);
			case 'MESSAGE_REACTION_REMOVE':
				return this.client.emit(
					'messageReactionRemove',
					reaction,
					this.client.users.resolve(packet.d.user_id)!
				);
		}
	}
}
