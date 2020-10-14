import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { TextChannel } from 'discord.js';
import { User } from 'discord.js';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Starboard } from '../../structure/starboard/star';
import { StarModel } from '../../model/star';
import { MessageEmbed } from 'discord.js';

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
			(config.features.starboard.ignoredChannels &&
				config.features.starboard.ignoredChannels.includes(msg.channel.id))
		)
			return;

		if (msg.author.id === this.client.user?.id) return;

		const minLevel =
			config.features.starboard.minimumPermLevel || PermissionLevel.Everyone;
		const addedEmoji = reaction.emoji;

		let triggerEmoji = config.features.starboard.emoji
			? Starboard.getEmojiFromId(this.client, config.features.starboard.emoji)
			: '⭐';

		if (!Starboard.emojiEquals(addedEmoji, triggerEmoji)) return;

		const member = msg.guild.member(user)!;
		if (getPermissionLevel(member, this.client) === PermissionLevel.Muted)
			return reaction.remove();

		if (msg.author.id === user.id && Starboard.emojiEquals(addedEmoji, triggerEmoji)) return reaction.remove()

		const triggerAmount = config.features.starboard.triggerAmount;
		const count = reaction.count;
		if (!count) return;

		const channel = msg.guild.channels.cache.get(
			config.features.starboard.channel
		) as TextChannel;

		const exists = await Starboard.exists(msg.id);
		if (exists) {
			let entry = await StarModel.findOne({ _id: msg.id });
			if (entry?.starredBy.includes(user.id)) return;
			await entry?.updateOne({
				starredBy: entry.starredBy.concat(user.id),
				starAmount: count,
			});
			let author = msg.guild.member(msg);
			const embed = new MessageEmbed()
				.setColor('YELLOW')
				.setTimestamp()
				.setAuthor(author?.displayName, msg.author.displayAvatarURL())
				.setDescription(`${msg.content}\n\n[Jump!](${msg.url})`);

			const img = Starboard.findImg(msg);
			if (img) embed.setImage(img);

			let pinMsg = await channel.messages.fetch(entry!.storageMsg);

			return pinMsg.edit(`⭐**${count}** ${msg.channel} `, embed);
		}

		const canStar = reaction.users.cache.some(
			user =>
				getPermissionLevel(msg.guild?.member(user)!, this.client) >= minLevel
		);

		if (count >= triggerAmount && canStar) {
			const starredBy = reaction.users.cache.keyArray();
			const star: Starboard = new Starboard({
				msg,
				channel,
				count,
				starredBy,
			});
			star.add();
		}
	}
}
