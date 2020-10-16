import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { TextChannel } from 'discord.js';
import { User } from 'discord.js';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Starboard } from '../../structure/starboard/starboardMessage';
import { StarModel } from '../../model/starboardMessage';
import { MessageEmbed } from 'discord.js';
import { emojiEquals, findImg } from '../../util/functions';

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

		const minStarboardPermTriggerLvl =
			starboardConfig.minimumPermLevel || PermissionLevel.Everyone;

		const emojiAddedByUser = reaction.emoji;
		const starboardTriggerEmoji = starboardConfig.emoji
			? emojiEquals(this.client, starboardConfig.emoji)
			: '⭐';

		if (!emojiEquals(emojiAddedByUser, starboardTriggerEmoji)) return;

		const member = msg.guild.member(user)!;
		const userPermissionLvl = getPermissionLevel(member, this.client);

		if (userPermissionLvl === PermissionLevel.Muted)
			return reaction.users.remove(user);

		if (
			msg.author.id === user.id &&
			emojiEquals(emojiAddedByUser, starboardTriggerEmoji)
		)
			return reaction.users.remove(user);

		const starboardTriggerAmount = starboardConfig.triggerAmount;
		const addedEmojiCount = reaction.count;
		if (!addedEmojiCount) return;

		const starboardChannel = msg.guild.channels.cache.get(
			starboardConfig.channel
		) as TextChannel;

		// Updates existing starboard entries
		const starboardMsgExists = await StarModel.exists({ _id: msg.id });
		if (starboardMsgExists) {
			const starboardEntry = await StarModel.findOne({ _id: msg.id });
			if (starboardEntry?.starredBy.includes(user.id)) return;
			await starboardEntry?.updateOne({
				starredBy: starboardEntry.starredBy.concat(user.id),
				starAmount: addedEmojiCount,
			});

			const starredMsgMember = msg.guild.member(starboardEntry!.author);
			const embed = new MessageEmbed()
				.setColor('YELLOW')
				.setTimestamp()
				.setAuthor(
					starredMsgMember?.displayName,
					starredMsgMember?.user.displayAvatarURL()
				);
			embed.setDescription(
				`${msg.content ? `${msg.content}\n\n` : ''}[Jump!](${msg.url})`
			);

			const img = findImg(msg);
			if (img) embed.setImage(img);

			const starEntryMessage = await starboardChannel.messages.fetch(
				starboardEntry!.starEntryId
			);

			return starEntryMessage.edit(
				`⭐**${addedEmojiCount}** ${msg.channel} `,
				embed
			);
		}

		//Checks if any reaction is by a user with permission level greater than the specified config value.
		const minPermLevelMet = reaction.users.cache.some(
			user =>
				getPermissionLevel(msg.guild?.member(user)!, this.client) >=
				minStarboardPermTriggerLvl
		);

		if (addedEmojiCount >= starboardTriggerAmount && minPermLevelMet) {
			const starredBy = reaction.users.cache.keyArray();
			const starboardMessage = new Starboard({
				msg,
				channel: starboardChannel,
				count: addedEmojiCount,
				starredBy,
			});
			starboardMessage.addStarboardMessage();
		}
	}
}
