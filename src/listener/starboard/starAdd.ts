import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { TextChannel } from 'discord.js';
import { User } from 'discord.js';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Star } from '../../structure/starboard/star';

export default class StarAddListener extends Listener {
	constructor() {
		super('starAdd', {
			emitter: 'client',
			event: 'messageReactionAdd',
		});
	}

	async exec(reaction: MessageReaction, user: User) {
		const msg = reaction.message;
		if (!msg.guild) return;
		const config = guildConfigs.get(msg.guild.id);
		
		if (
			!config ||
			!config.features.starboard ||
			!config.features.starboard.channel ||
			!config.features.starboard.triggerAmount ||
			(config.features.starboard.ignoredChannels && config.features.starboard.ignoredChannels.includes(msg.channel.id))
		)
			return;
		
		const exists = await Star.exists(msg.id)
		if (exists) return;

		const minLevel = config.features.starboard.minimumPermLevel || PermissionLevel.Everyone
		const addedEmoji = reaction.emoji;
		
		let triggerEmoji;
		if (config.features.starboard.emoji) {
			triggerEmoji = Star.getEmojiFromId(this.client, config.features.starboard.emoji)
		}
		else {
			triggerEmoji = "⭐"
		}

		const member = msg.guild.member(user)!;
		if (getPermissionLevel(member, this.client) === PermissionLevel.Muted) return reaction.remove();
		
		//if (msg.author.id === user.id && Star.emojiEquals(addedEmoji, triggerEmoji)) return reaction.remove()

		const triggerAmount = config.features.starboard.triggerAmount;
		const count = reaction.count;
		if (!count) return;
		
		const canStar = reaction.users.cache.some(user => getPermissionLevel(msg.guild?.member(user)!, this.client) >= minLevel)
	
		
		if (Star.emojiEquals(addedEmoji, triggerEmoji)) {
			if (count >= triggerAmount && canStar) {
				const channel = msg.guild.channels.cache.get(config.features.starboard.channel) as TextChannel;
				const star: Star = new Star({
					msg,
					channel,
					count
				});
				star.add();
			}
			
		}
		


	}
}
