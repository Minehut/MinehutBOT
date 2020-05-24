import { GuildMember, Message } from 'discord.js';
import { CaseModel, Case } from '../../model/case';
import { DocumentType } from '@typegoose/typegoose';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import truncate from 'truncate';

interface WarnActionData {
	target: GuildMember;
	moderator: GuildMember;
	reason: string;
	message: Message;
}

export class WarnAction {
	target: GuildMember;
	moderator: GuildMember;
	message: Message;
	reason: string;
	document?: DocumentType<Case>;
	id?: number;

	constructor(data: WarnActionData) {
		this.target = data.target;
		this.moderator = data.moderator;
		this.message = data.message;
		this.reason = truncate(data.reason, 2000);
	}

	async commit() {
		// To execute the action and the after method
		await this.getId();
		await this.sendTargetDm();
		this.document = await CaseModel.create({
			_id: this.id,
			active: false,
			moderatorId: this.moderator.id,
			moderatorTag: this.moderator.user.tag,
			targetId: this.target.id,
			targetTag: this.target.user.tag,
			expiresAt: new Date(-1),
			reason: this.reason,
			type: CaseType.Warn,
		} as Case);
		await this.after();
	}

	async after() {
		// To log the action
		if (!this.document) return;
		// TODO: add mod log thingy
		console.log(`mod log stuff, ${this.document.toString()}`);
	}

	async getId() {
		if (this.id) return this.id;
		this.id = (await CaseModel.countDocuments()) + 1;
		return this.id;
	}

	async sendTargetDm() {
		const embed = new MessageEmbed()
			.setColor('RED')
			.setDescription(
				'**You have been warned on Minehut!**\nFuture infractions may lead to a more serious punishment.'
			)
			.addField('ID', this.id, true)
			.addField('Reason', this.reason, true)
			.setTimestamp();
		await this.target.send(embed);
	}
}
