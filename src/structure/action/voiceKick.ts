import { GuildMember } from 'discord.js';
import { CaseModel, Case } from '../../model/case';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import { Action, ActionData } from './action';

type VoiceKickActionData = {
	target: GuildMember;
} & ActionData;

export class VoiceKickAction extends Action {
	target: GuildMember;

	constructor(data: VoiceKickActionData) {
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
		if (!this.target.voice.channel) return;
		await this.sendTargetDm();
		await this.target.voice.setChannel(null, `[#${this.id}] ${this.reason}`);
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
			type: CaseType.VoiceKick,
		} as Case);
		await this.after();
		return this.document;
	}

	async sendTargetDm() {
		try {
			if (this.target.id === this.target.client.user?.id) return; // The bot can't message itself
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription(
					`**You have been kicked from a ${this.guild.name} voice channel!**\nFuture infractions may lead to a more serious punishment.`
				)
				.addField('ID', this.id, true)
				.addField('Reason', this.reason, true)
				.setTimestamp();
			await this.target.send(embed);
		} catch (err) {}
	}
}
