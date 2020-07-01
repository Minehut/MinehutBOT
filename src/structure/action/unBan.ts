import { CaseModel } from '../../model/case';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import { User } from 'discord.js';
import { Action, ActionData } from './action';

type UnBanActionData = {
	target: User;
} & ActionData;

export class UnBanAction extends Action {
	target: User;

	constructor(data: UnBanActionData) {
		super({
			guild: data.guild,
			reason: data.reason,
			client: data.client,
			moderator: data.moderator,
		});
		this.target = data.target;
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
		});
		await this.after();
		return this.document;
	}

	async sendTargetDm() {
		try {
			if (this.target.id === this.target.client.user?.id) return; // The bot can't message itself
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription(`**You have been unbanned from ${this.guild.name}**`)
				.addField('ID', this.id, true)
				.addField('Reason', this.reason, true)
				.setTimestamp();
			await this.target.send(embed);
		} catch (err) {}
	}
}
