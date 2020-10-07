import { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { MinehutClient } from "../../client/minehutClient";
import { StarModel } from "../../model/star";
import { IMGUR_LINK_REGEX } from "../../util/constants";

export interface StarData {
	msg: Message;
	channel: TextChannel;
	count: number;
}

export class Star {
	channel: TextChannel;
	msg: Message;
	count: number;

	constructor(data: StarData) {
		this.channel = data.channel;
		this.msg = data.msg;
		this.count = data.count;
    }

	async add() {
		const member = this.msg.member;
		
		let matches = this.msg.content.match(IMGUR_LINK_REGEX);
		let content = this.msg.content;
		const embed = new MessageEmbed()
			.setColor('YELLOW')
			.setTimestamp()
			.setAuthor(member?.displayName, this.msg.author.displayAvatarURL())
			.setDescription(`${content}\n\n[Jump!](${this.msg.url})`);
		if (matches) {
			const link = matches[0];
			content = this.msg.content.replace(link, '');
			embed.setImage(link);
		}
		else if (this.msg.attachments) {
			let firstAttached = this.msg.attachments.first();
			if (firstAttached?.width) {
				embed.setImage(firstAttached.url);
			}
		}

		await StarModel.create({
			_id: this.msg.id,
			author: this.msg.author.id,
			guild: this.msg.guild!.id,
			starAmount: this.count
		})
		await this.channel.send(`⭐**${this.count}** ${this.msg.channel} `, embed);
	}

	static async exists(id: string) {
		return await StarModel.exists({_id: id})
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
		console.log(x, y)
		return x.identifier === y.identifier;
	}

	static getEmojiFromId(client: MinehutClient, id: string) {
		if (/^\d+$/.test(id)) {
			return client.emojis.cache.get(id);
		}
		
		return id;
	}

}