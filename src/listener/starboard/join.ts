import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { User } from 'discord.js';
import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export default class StarAddListener extends Listener {
	constructor() {
		super('starAdd', {
			emitter: 'client',
			event: 'messageReactionAdd',
		});
	}

	async exec(reaction: MessageReaction, user: User) {
		const message = reaction.message;
		if (!message.guild) return;
		const config = guildConfigs.get(message.guild.id);
		if (
			!config ||
			!config.features.starboard ||
			!config.features.starboard.channel ||
			(config.features.starboard.ignoredChannels && config.features.starboard.ignoredChannels.includes(message.channel.id))
		)
			return;

		const emoji = reaction.emoji;
		if (emoji.toString() === "⭐") {
			if (message.reactions.cache.size >= config.features.starboard.triggerAmount) {
				const channel = message.guild.channels.cache.get(config.features.starboard.channel) as TextChannel
				const member = message.guild.member(user)
				const embed = new MessageEmbed()
					.setColor('YELLOW')
					.setTimestamp()
					.setAuthor(member?.displayName, user.displayAvatarURL())
					.setDescription(`${message.content}\n\n[Jump!](${message.url})`)
				channel.send(`⭐**${message.reactions.cache.size}** ${message.channel} `, embed)
			}
			
		}
		


	}
}
