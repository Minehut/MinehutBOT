import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MessageReaction } from 'discord.js';
import { TextChannel } from 'discord.js';
import { User } from 'discord.js';
import { Starboard } from '../../structure/starboard/star';
import { StarModel } from '../../model/star';
import { MessageEmbed } from 'discord.js';

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

		if (user.id === this.client.user?.id) return;
		if (msg.author.id === this.client.user?.id) return;

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

		const addedEmoji = reaction.emoji;

		let triggerEmoji = config.features.starboard.emoji
			? Starboard.getEmojiFromId(this.client, config.features.starboard.emoji)
			: '⭐';

		if (!Starboard.emojiEquals(addedEmoji, triggerEmoji)) return;

		const count = reaction.count || 0;

		const channel = msg.guild.channels.cache.get(
			config.features.starboard.channel
		) as TextChannel;

		const exists = await Starboard.exists(msg.id);
		if (!exists) return;

		let entry = await StarModel.findOne({ _id: msg.id });
		const pinMsg = await channel.messages.fetch(entry!.storageMsg);
		if (!entry?.starredBy.includes(user.id)) return;

		if (count === 0) {
			if (pinMsg.deletable) pinMsg.delete({ reason: 'unstarred' });
			return await StarModel.deleteOne({ _id: msg.id });
		}

		await entry?.updateOne({
			starredBy: entry.starredBy.splice(entry.starredBy.indexOf(user.id)),
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

		return pinMsg.edit(`⭐**${count}** ${msg.channel} `, embed);
	}
}
