import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { User, TextChannel, MessageReaction, MessageEmbed } from 'discord.js';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { StarboardMessage } from '../../structure/starboard/starboardMessage';
import { StarMessageModel } from '../../model/starboardMessage';
import { findImageFromMessage } from '../../util/functions';

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

		if (msg.author.id === this.client.user?.id) return;

		if (this.client.starboardCooldownManager.isOnCooldown(user.id)) return;

		const minStarboardPermTriggerLvl =
			starboardConfig.minimumPermLevel ?? PermissionLevel.Everyone;

		const emojiAddedByUser = reaction.emoji.toString();	
		const starboardTriggerEmoji = starboardConfig.emoji ?? '⭐';

		if (emojiAddedByUser !== starboardTriggerEmoji) return;

		const member = msg.guild.member(user)!;

		const userPermissionLvl = getPermissionLevel(member, this.client);

		if (userPermissionLvl === PermissionLevel.Muted) return;

		if (
			msg.author.id === user.id &&
			emojiAddedByUser === starboardTriggerEmoji
		)
			return;

		const starboardTriggerAmount = starboardConfig.triggerAmount;
		const addedEmojiCount = reaction.count;
		if (!addedEmojiCount) return;

		const starboardChannel = msg.guild.channels.cache.get(
			starboardConfig.channel
		) as TextChannel;

		// Updates existing starboard entries
		const starboardEntry = await StarMessageModel.findOne({ _id: msg.id });
		if (starboardEntry !== null) {
			if (starboardEntry.starredBy.includes(user.id)) return;
			this.client.starboardCooldownManager.add(user.id);
			await starboardEntry.updateOne({
				starredBy: starboardEntry.starredBy.concat(user.id),
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

			const starboardMessageImage = findImageFromMessage(msg);
			if (starboardMessageImage) embed.setImage(starboardMessageImage);

			const starEntryMessage = await starboardChannel.messages.fetch(
				starboardEntry!.starEntryId
			);

			return starEntryMessage.edit(
				`${starboardConfig.emoji} ?? '⭐' **${addedEmojiCount}** ${msg.channel} `,
				embed
			);
		}

		// Checks if any reaction is by a user with permission level greater than the specified config value.
		const minPermLevelMet = reaction.users.cache.some(
			user =>
				getPermissionLevel(msg.guild?.member(user)!, this.client) >=
				minStarboardPermTriggerLvl
		);

		if (addedEmojiCount >= starboardTriggerAmount && minPermLevelMet) {
			const starredBy = reaction.users.cache.keyArray();
			const starboardMessage = new StarboardMessage({
				msg,
				channel: starboardChannel,
				count: addedEmojiCount,
				starredBy,
			});
			starboardMessage.addStarboardMessage();
		}
	}
}
