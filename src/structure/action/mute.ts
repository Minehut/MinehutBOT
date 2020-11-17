import { GuildMember } from 'discord.js';
import { CaseModel } from '../../model/case';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { prettyDate } from '../../util/functions';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { Action, ActionData } from './action';

type MuteActionData = {
	target: GuildMember;
	duration: number;
} & ActionData;

export class MuteAction extends Action {
	target: GuildMember;
	duration: number;
	expiresAt: Date;

	constructor(data: MuteActionData) {
		super({
			guild: data.guild,
			reason: data.reason,
			client: data.client,
			moderator: data.moderator,
		});
		this.target = data.target;
		this.moderator = data.moderator;
		this.duration = data.duration;
		this.expiresAt = new Date(Date.now() + this.duration);
	}

	async commit() {
		// To execute the action and the after method
		if (!this.target.manageable) return;
		// Make previous mutes inactive
		await CaseModel.updateMany(
			{
				guild: this.guild.id,
				active: true,
				type: CaseType.Mute,
				targetId: this.target.id,
			},
			{ active: false }
		);
		const muteRole = guildConfigs.get(this.guild.id)?.roles.muted;
		if (!muteRole) return;
		await this.sendTargetDm();
		this.document = await CaseModel.create({
			_id: this.id,
			active: true,
			moderatorId: this.moderator.id,
			moderatorTag: this.moderator.user.tag,
			targetId: this.target.id,
			targetTag: this.target.user.tag,
			expiresAt: this.expiresAt,
			reason: this.reason,
			guild: this.guild.id,
			type: CaseType.Mute,
		});
		await this.target.roles.add(muteRole, `[#${this.id}] ${this.reason}`);
		await this.client.muteScheduler.refresh();
		await this.after();
		return this.document;
	}

	async sendTargetDm() {
		try {
			if (this.target.id === this.target.client.user?.id) return; // The bot can't message itself
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription(`**You have been muted on ${this.guild.name}!**`)
				.addField('ID', this.id, true)
				.addField('Reason', this.reason, true)
				.addField(
					'Duration',
					humanizeDuration(this.duration, { largest: 3, round: true })
				)
				.addField('Expires', prettyDate(this.expiresAt))
				.addField('Punished unfairly? [Appeal here](https://forums.minehut.com/application/form/5-player-appeals/)', true)
				.setTimestamp()
				.setFooter('forums.minehut.com', 'https://i.imgur.com/dnyXrKy.png');
			await this.target.send(embed);
		} catch (err) {}
	}
}
