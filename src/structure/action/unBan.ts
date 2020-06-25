import { GuildMember, Message } from 'discord.js';
import { CaseModel, Case } from '../../model/case';
import { DocumentType } from '@typegoose/typegoose';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import truncate from 'truncate';
import { User } from 'discord.js';
import { Action } from './action';

interface UnBanActionData {
	target: User;
	moderator: GuildMember;
	reason?: string;
	message?: Message;
}

export class UnBanAction extends Action {
	target: User;
	moderator: GuildMember;
	message?: Message;
	reason: string;
	document?: DocumentType<Case>;

	constructor(data: UnBanActionData) {
		super();
		this.target = data.target;
		this.moderator = data.moderator;
		this.message = data.message;
		this.reason = truncate(data.reason || 'No reason provided', 2000);
	}

	async commit() {
		// To execute the action and the after method
		// await this.sendTargetDm(); // Bot can't message users who aren't in the guild
		try {
			// Make all old bans inactive
			await CaseModel.updateMany(
				{
					guildId: this.moderator.guild.id,
					active: true,
					$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
					targetId: this.target.id,
				},
				{ active: false }
			);
			await this.moderator.guild.members.unban(this.target.id);
		} catch (err) {}
		this.document = await CaseModel.create({
			_id: this.id,
			active: false,
			moderatorId: this.moderator.id,
			moderatorTag: this.moderator.user.tag,
			targetId: this.target.id,
			targetTag: this.target.tag,
			expiresAt: new Date(-1),
			reason: this.reason,
			guildId: this.moderator.guild.id,
			type: CaseType.UnBan,
		} as Case);
		await this.after();
	}

	async after() {
		// To log the action
		if (!this.document) return;
		// TODO: add mod log thingy
		console.log(`mod log stuff, ${this.document.toString()}`);
	}

	async sendTargetDm() {
		try {
			if (this.target.id === this.target.client.user?.id) return; // The bot can't message itself
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription('**You have been unbanned from Minehut**')
				.addField('ID', this.id, true)
				.addField('Reason', this.reason, true)
				.setTimestamp();
			await this.target.send(embed);
		} catch (err) {}
	}
}