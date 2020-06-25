import { GuildMember, Message } from 'discord.js';
import { CaseModel, Case } from '../../model/case';
import { DocumentType } from '@typegoose/typegoose';
import { CaseType } from '../../util/constants';
import { MessageEmbed } from 'discord.js';
import truncate from 'truncate';
import humanizeDuration from 'humanize-duration';
import { MinehutClient } from '../../client/minehutClient';
import { prettyDate } from '../../util/util';
import { User } from 'discord.js';
import { Guild } from 'discord.js';
import { Action } from './action';

interface BanActionData {
	target: User;
	moderator: GuildMember;
	reason?: string;
	message?: Message;
	duration: number;
	client: MinehutClient;
	guild: Guild;
}

export class BanAction extends Action {
	target: User;
	moderator: GuildMember;
	message?: Message;
	reason: string;
	duration: number;
	expiresAt: Date;
	document?: DocumentType<Case>;
	client: MinehutClient;
	guild: Guild;

	constructor(data: BanActionData) {
		super();
		this.target = data.target;
		this.moderator = data.moderator;
		this.message = data.message;
		this.reason = truncate(data.reason || 'No reason provided', 2000);
		this.duration = data.duration;
		this.expiresAt = new Date(Date.now() + this.duration);
		this.client = data.client;
		this.guild = data.guild;
	}

	async commit() {
		// To execute the action and the after method
		const member = this.guild.member(this.target);
		if (member && !member.bannable) return;

		// Make previous bans inactive
		await CaseModel.updateMany(
			{
				guildId: this.guild.id,
				active: true,
				$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
				targetId: this.target.id,
			},
			{ active: false }
		);

		await this.sendTargetDm();
		await this.guild.members.ban(this.target, {
			reason: `[#${this.id}] ${this.reason}`,
		}); // todo: add days option
		this.document = await CaseModel.create({
			_id: this.id,
			active: true,
			moderatorId: this.moderator.id,
			moderatorTag: this.moderator.user.tag,
			targetId: this.target.id,
			targetTag: this.target.tag,
			expiresAt: this.expiresAt,
			reason: this.reason,
			guildId: this.guild.id,
			type: CaseType.Ban,
		} as Case);
		await this.after();
	}

	async after() {
		// To log the action
		if (!this.document) return;
		// TODO: add mod log thingy
		console.log(`mod log stuff, ${this.document.toString()}`);
		await this.client.banScheduler.refresh();
	}

	async sendTargetDm() {
		try {
			if (this.target.id === this.target.client.user?.id) return; // The bot can't message itself
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription('**You have been banned from Minehut!**')
				.addField('ID', this.id, true)
				.addField('Reason', this.reason, true)
				.addField(
					'Duration',
					humanizeDuration(this.duration, { largest: 3, round: true })
				)
				.addField('Expires', prettyDate(this.expiresAt))
				.setTimestamp();
			await this.target.send(embed);
		} catch (err) {}
	}
}
