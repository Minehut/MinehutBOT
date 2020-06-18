import { GuildMember, Message } from 'discord.js';
import { CaseModel, Case } from '../../model/case';
import { DocumentType } from '@typegoose/typegoose';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import truncate from 'truncate';
import { getNextCaseId } from '../../util/util';

interface SoftBanActionData {
	target: GuildMember;
	moderator: GuildMember;
	reason?: string;
	message?: Message;
}

export class SoftBanAction {
	target: GuildMember;
	moderator: GuildMember;
	message?: Message;
	reason: string;
	document?: DocumentType<Case>;
	id?: number;

	constructor(data: SoftBanActionData) {
		this.target = data.target;
		this.moderator = data.moderator;
		this.message = data.message;
		this.reason = truncate(data.reason || 'No reason provided', 2000);
	}

	async commit() {
		// To execute the action and the after method
		if (!this.target.bannable) return;
		await this.getId();
		await this.sendTargetDm();
		const id = this.id;
		await this.target.ban({ reason: `[#${id}] ${this.reason}`, days: 7 });
		await this.target.guild.members.unban(this.target.id);
		this.document = await CaseModel.create({
			_id: id,
			active: false,
			moderatorId: this.moderator.id,
			moderatorTag: this.moderator.user.tag,
			targetId: this.target.id,
			targetTag: this.target.user.tag,
			expiresAt: new Date(-1),
			reason: this.reason,
			guildId: this.target.guild.id,
			type: CaseType.SoftBan,
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
		this.id = await getNextCaseId();
		return this.id;
	}

	async sendTargetDm() {
		try {
			if (this.target.id === this.target.client.user?.id) return; // The bot can't message itself
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription(
					'**You have been softbanned from Minehut!**\nYou can rejoin the server immediately, but your old messages were deleted.\nFuture infractions may lead to a more serious punishment.'
				)
				.addField('ID', this.id, true)
				.addField('Reason', this.reason, true)
				.setTimestamp();
			await this.target.send(embed);
		} catch (err) {}
	}
}
