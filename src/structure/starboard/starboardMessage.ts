import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { GuildConfiguration } from '../../guild/config/guildConfiguration';
import { StarMessageModel } from '../../model/starboardMessage';
import { findImageFromMessage } from '../../util/functions';

export interface StarboardMessageData {
	msg: Message;
	channel: TextChannel;
	count: number;
	starredBy: string[];
}

export class StarboardMessage {
	channel: TextChannel;
	msg: Message;
	count: number;
	starredBy: string[];
	config: GuildConfiguration | undefined;

	constructor(data: StarboardMessageData) {
		this.channel = data.channel;
		this.msg = data.msg;
		this.count = data.count;
		this.starredBy = data.starredBy;
		this.config = guildConfigs.get(data.msg.id);
	}

	// If this method is called, it is assumed that checks have been made that the starboard is configured properly.
	async addStarboardMessage() {
		const author = this.msg.author;
		const embed = new MessageEmbed()
			.setColor('YELLOW')
			.setTimestamp(this.msg.createdAt)
			.setAuthor(author.tag, author.displayAvatarURL());
		embed.setDescription(
			`${this.msg.content ? `${this.msg.content}\n\n` : ''}[Jump!](${
				this.msg.url
			})`
		);

		const img = findImageFromMessage(this.msg);
		if (img) embed.setImage(img);

		const sentStarboardEntry = await this.channel.send(
			`${this.config?.features?.starboard?.emoji ?? '⭐'}**${this.count}** ${
				this.msg.channel
			} `,
			embed
		);
		await StarMessageModel.create({
			_id: this.msg.id,
			author: this.msg.author.id,
			guild: this.msg.guild!.id,
			starEntryId: sentStarboardEntry.id,
			starAmount: this.count,
			starredBy: this.starredBy,
		});
	}
}
