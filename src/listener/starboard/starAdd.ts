import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { IMGUR_LINK_REGEX } from '../../util/constants';
import { User } from 'discord.js';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';

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
			!config.features.starboard.triggerAmount ||
			(config.features.starboard.ignoredChannels && config.features.starboard.ignoredChannels.includes(message.channel.id))
		)
			return;
		
		let member = message.guild.member(user)
		if (!member) return;
		if (getPermissionLevel(member, this.client) === PermissionLevel.Muted) return reaction.remove();

		let triggerAmount = config.features.starboard.triggerAmount;
		let count = reaction.count;
		if (!count) return;
		
		const emoji = reaction.emoji;
		if (emoji.toString() === "⭐") {
			if (count >= triggerAmount) {
				const channel = message.guild.channels.cache.get(config.features.starboard.channel) as TextChannel
				const member = message.guild.member(message.author)
				const embed = new MessageEmbed()
					.setColor('YELLOW')
					.setTimestamp()
					.setAuthor(member?.displayName, message.author.displayAvatarURL());
				
				let matches = message.content.match(IMGUR_LINK_REGEX);
				let content = message.content;
				if (matches) {
					const link = matches[0];
					content = message.content.replace(link, '');
					embed.setImage(link);
				}
				else if (message.attachments) {
					let firstAttached = message.attachments.first()
					if (firstAttached?.width) {
						embed.setImage(firstAttached.url)
					}
				}
				embed.setDescription(`${content}\n\n[Jump!](${message.url})`)
				
				channel.send(`⭐**${count}** ${message.channel} `, embed)
			}
			
		}
		


	}
}
