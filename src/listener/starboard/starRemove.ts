import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { TextChannel } from 'discord.js';
import { User } from 'discord.js';
import { StarMessageModel } from '../../model/starboardMessage';
import { MessageEmbed } from 'discord.js';
import { findImageFromMessage } from '../../util/functions';

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

		if (
			user.id === this.client.user?.id ||
			msg.author.id === this.client.user?.id
		)
			return;

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

		const emojiAddedByUser = reaction.emoji.toString();
		const starboardTriggerEmoji = starboardConfig.emoji ?? '⭐';

		if (emojiAddedByUser !== starboardTriggerEmoji) return;

		const addedEmojiCount = reaction.count ?? 0;

		const starboardChannel = msg.guild.channels.cache.get(
			starboardConfig.channel
		) as TextChannel;

		const starboardEntry = await StarMessageModel.findOne({ _id: msg.id });
		if (starboardEntry === null) return;

		const starEntryMessage = await starboardChannel.messages.fetch(
			starboardEntry.starEntryId
		);
		if (!starboardEntry.starredBy.includes(user.id)) return;

		if (addedEmojiCount === 0) {
			if (starEntryMessage.deletable)
				starEntryMessage.delete({ reason: 'unstarred' });
			return await StarMessageModel.deleteOne({ _id: msg.id });
		}

		await starboardEntry.updateOne({
			starredBy: starboardEntry.starredBy.filter(savedUser => savedUser != user.id),
			starAmount: addedEmojiCount,
		});

		const embed = new MessageEmbed()
			.setColor('YELLOW')
			.setTimestamp(msg.createdAt)
			.setAuthor(
				msg.author.tag,
				msg.author.displayAvatarURL()
			);
		embed.setDescription(
			`${msg.content ? `${msg.content}\n\n` : ''}[Jump!](${msg.url})`
		);

		const img = findImageFromMessage(msg);
		if (img) embed.setImage(img);

		return starEntryMessage.edit(
			`${starboardConfig.emoji ?? '⭐'} **${addedEmojiCount}** ${msg.channel} `,
			embed
		);
	}
}
