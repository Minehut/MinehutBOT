import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { StarModel } from '../../model/starboardMessage';
import { findImgFromMsg } from '../../util/functions';

export interface StarboardMessageData {
	msg: Message;
	channel: TextChannel;
	count: number;
	starredBy: string[];
}

export class Starboard {
	channel: TextChannel;
	msg: Message;
	count: number;
	starredBy: string[];

	constructor(data: StarboardMessageData) {
		this.channel = data.channel;
		this.msg = data.msg;
		this.count = data.count;
		this.starredBy = data.starredBy;
	}

	async addStarboardMessage() {
		const member = this.msg.member;
		const embed = new MessageEmbed()
			.setColor('YELLOW')
			.setTimestamp()
			.setAuthor(member?.displayName, member?.user.displayAvatarURL());
		embed.setDescription(
			`${this.msg.content ? `${this.msg.content}\n\n` : ''}[Jump!](${
				this.msg.url
			})`
		);

		const img = findImgFromMsg(this.msg);
		if (img) embed.setImage(img);

		const sentStarboardEntry = await this.channel.send(
			`⭐**${this.count}** ${this.msg.channel} `,
			embed
		);
		await StarModel.create({
			_id: this.msg.id,
			author: this.msg.author.id,
			guild: this.msg.guild!.id,
			starEntryId: sentStarboardEntry.id,
			starAmount: this.count,
			starredBy: this.starredBy,
		});
	}
}
