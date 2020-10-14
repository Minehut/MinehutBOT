import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import path from 'path';
import { MinehutClient } from '../../client/minehutClient';
import { StarModel } from '../../model/star';
import { IMGUR_LINK_REGEX } from '../../util/constants';

export interface StarboardData {
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

	constructor(data: StarboardData) {
		this.channel = data.channel;
		this.msg = data.msg;
		this.count = data.count;
		this.starredBy = data.starredBy;
	}

	async add() {
		const member = this.msg.member;
		
		let matches = this.msg.content.match(IMGUR_LINK_REGEX);
		let content = this.msg.content;
		const embed = new MessageEmbed()
			.setColor('YELLOW')
			.setTimestamp()
			.setAuthor(member?.displayName, this.msg.author.displayAvatarURL());
		if (this.msg.content) {
			embed.setDescription(`${this.msg.content}\n\n[Jump!](${this.msg.url})`);
		} else {
			embed.setDescription(`[Jump!](${this.msg.url})`);
		}
		const img = Starboard.findImg(this.msg);
		if (img) embed.setImage(img);

		let sent = await this.channel.send(
			`⭐**${this.count}** ${this.msg.channel} `,
			embed
		);
		await StarModel.create({
			_id: this.msg.id,
			author: this.msg.author.id,
			guild: this.msg.guild!.id,
			storageMsg: sent.id,
			starAmount: this.count,
			starredBy: this.starredBy,
		});
	}

	static async exists(id: string) {
		return await StarModel.exists({ _id: id });
	}

	static emojiEquals(x: any, y: any) {
		if (typeof x === 'string' && typeof y === 'string') {
			return x === y;
		}

		if (typeof x === 'string') {
			return x === y.name;
		}

		if (typeof y === 'string') {
			return x.name === y;
		}

		return x.identifier === y.identifier;
	}

	static getEmojiFromId(client: MinehutClient, id: string) {
		if (/^\d+$/.test(id)) {
			return client.emojis.cache.get(id);
		}

		return id;
	}

	static findImg(msg: Message) {
		let returnAttachment;
		const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

		const attachment = msg.attachments.find(file =>
			extensions.includes(path.extname(file.url))
		);
		if (attachment) returnAttachment = attachment.url;

		if (!returnAttachment) {
			const match = msg.content.match(IMGUR_LINK_REGEX);
			if (match && extensions.includes(path.extname(match[0]))) {
				returnAttachment = match[0];
			}
		}

		return returnAttachment;
	}
}
