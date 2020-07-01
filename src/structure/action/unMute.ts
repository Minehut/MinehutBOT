import { GuildMember } from 'discord.js';
import { CaseModel, Case } from '../../model/case';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import { guildConfigs } from '../../guild/guildConfigs';
import { Action, ActionData } from './action';

type UnMuteActionData = {
	target: GuildMember;
} & ActionData;

export class UnMuteAction extends Action {
	target: GuildMember;

	constructor(data: UnMuteActionData) {
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
		if (!this.target.manageable) return;
		await this.sendTargetDm();
		const muteRole = guildConfigs.get(this.target.guild!.id)?.roles.muted;
		if (!muteRole) return;
		try {
			// Make all old mutes inactive
			await CaseModel.updateMany(
				{
					guildId: this.target.guild!.id,
					active: true,
					type: CaseType.Mute,
					targetId: this.target.id,
				},
				{ active: false }
			);
			await this.target.roles.remove(muteRole, `[#${this.id}] ${this.reason}`);
		} catch (err) {}
		this.document = await CaseModel.create({
			_id: this.id,
			active: false,
			moderatorId: this.moderator.id,
			moderatorTag: this.moderator.user.tag,
			targetId: this.target.id,
			targetTag: this.target.user.tag,
			expiresAt: new Date(-1),
			reason: this.reason,
			guildId: this.target.guild.id,
			type: CaseType.UnMute,
		} as Case);
		await this.after();
		return this.document;
	}

	async sendTargetDm() {
		try {
			if (this.target.id === this.target.client.user?.id) return; // The bot can't message itself
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription(`**You have been unmuted on ${this.guild.name}**`)
				.addField('ID', this.id, true)
				.addField('Reason', this.reason, true)
				.setTimestamp();
			await this.target.send(embed);
		} catch (err) {}
	}
}
