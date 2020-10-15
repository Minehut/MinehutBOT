import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { TextChannel } from 'discord.js';
import { User } from 'discord.js';
import { StarModel } from '../../model/star';
import { MessageEmbed } from 'discord.js';
import { emojiEquals, findImg, getEmojiFromId } from '../../util/functions';

export default class StarRemoveListener extends Listener {
	constructor() {
		super('starRemove', {
			emitter: 'client',
			event: 'messageReactionRemove',
		});
	}

	async exec(reaction: MessageReaction, user: User) {
		const msg = reaction.message;
		if (!msg.guild) return;

		if (user.id === this.client.user?.id || msg.author.id === this.client.user?.id) return;

		const config = guildConfigs.get(msg.guild.id);
		const starboardConfig = config?.features.starboard;

		if (
			!config ||
			!starboardConfig ||
			!starboardConfig.channel ||
			!starboardConfig.triggerAmount ||
			(starboardConfig.ignoredChannels &&
				starboardConfig.ignoredChannels.includes(msg.channel.id))
		)
			return;

		const emojiAddedByUser = reaction.emoji;
		const starboardTriggerEmoji = starboardConfig.emoji
			? getEmojiFromId(this.client, starboardConfig.emoji)
			: '⭐';

		if (!emojiEquals(emojiAddedByUser, starboardTriggerEmoji)) return;

		const addedEmojiCount = reaction.count || 0;

		const starboardChannel = msg.guild.channels.cache.get(
			starboardConfig.channel
		) as TextChannel;

		const starboardMsgExists = await StarModel.exists({_id: msg.id});
		if (!starboardMsgExists) return;

		const starboardEntry = await StarModel.findOne({ _id: msg.id });
		const starEntryMessage = await starboardChannel.messages.fetch(starboardEntry!.starEntryId);
		if (!starboardEntry?.starredBy.includes(user.id)) return;

		if (addedEmojiCount === 0) {
			if (starEntryMessage.deletable) starEntryMessage.delete({ reason: 'unstarred' });
			return await StarModel.deleteOne({ _id: msg.id });
		}

		await starboardEntry?.updateOne({
			starredBy: starboardEntry.starredBy.splice(starboardEntry.starredBy.indexOf(user.id)),
			starAmount: addedEmojiCount,
		});

		const starredMsgMember = msg.guild.member(msg.author);
		const embed = new MessageEmbed()
			.setColor('YELLOW')
			.setTimestamp()
			.setAuthor(starredMsgMember?.displayName, starredMsgMember?.user.displayAvatarURL())
		embed.setDescription(`${msg.content ? `${msg.content}\n\n` : ''}[Jump!](${msg.url})`);

		const img = findImg(msg);
		if (img) embed.setImage(img);

		return starEntryMessage.edit(`⭐**${addedEmojiCount}** ${msg.channel} `, embed);
	}
}
