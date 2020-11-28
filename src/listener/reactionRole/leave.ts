import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { User } from 'discord.js';

export default class ReactionRoleLeaveListener extends Listener {
	constructor() {
		super('reactionRoleLeave', {
			emitter: 'client',
			event: 'messageReactionRemove',
		});
	}

	async exec(reaction: MessageReaction, user: User) {
		const message = reaction.message;
		if (!message.guild || user.bot) return;
		const config = guildConfigs.get(message.guild.id);
		if (
			!config ||
			!config.features.reactionRole ||
			config.features.reactionRole.channel !== message.channel.id
		)
			return;

		const emoji = reaction.emoji;
		const member = message.guild.member(user.id);
		if (!member) return;

		const reactionRole = config.features.reactionRole.roles.find(
			r => r.emoji === emoji.name
		);
		if (!reactionRole) throw new Error('Reaction roles: missing role config');

		if (!member.roles.cache.has(reactionRole.roleId)) return;

		const role = message.guild.roles.cache.get(reactionRole.roleId);
		if (!role) throw new Error('Reaction roles: could not get role by ID');

		member.roles.remove(role);
	}
}
