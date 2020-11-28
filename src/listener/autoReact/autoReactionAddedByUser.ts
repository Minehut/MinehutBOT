import { Listener } from 'discord-akairo';
import { User } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';

export default class AutoReactionAddedByUserListener extends Listener {
	constructor() {
		super('autoReactionAddedByUser', {
			emitter: 'client',
			event: 'messageReactionAdd',
		});
	}

	async exec(reaction: MessageReaction, user: User) {
		const msg = reaction.message;
		if (!msg.guild || user.bot) return;
		const autoReactConfig = guildConfigs.get(msg.guild.id)?.features.autoReact;
		if (!autoReactConfig || !autoReactConfig.channels) return;
		const autoReactChannel = autoReactConfig.channels.find(
			c => c.channel === msg.channel.id
		);
		if (!autoReactChannel) return;
		const autoReactions = msg.reactions.cache.filter(r =>
			autoReactChannel.reactions.includes(
				r.emoji.toString().replace(/[<>]/g, '')
			)
		);
		if (
			autoReactions.some(r => r === reaction) &&
			!autoReactChannel.allowMessageAuthorReacting &&
			msg.author === user
		)
			return reaction.users.remove(user);
		if (
			autoReactions.some(r => r !== reaction && r.users.cache.has(user.id)) &&
			!autoReactChannel.allowMultipleUserReactions
		)
			return reaction.users.remove(user);
	}
}
