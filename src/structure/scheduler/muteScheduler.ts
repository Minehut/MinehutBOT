import { CaseModel, Case } from '../../model/case';
import { CaseType } from '../../util/constants';
import { DocumentType } from '@typegoose/typegoose';
import { MinehutClient } from '../../client/minehutClient';
import { guildConfigs } from '../../guild/guildConfigs';

const EXPIRING_SOON_MS = 2.592e8; // 3 days
const REFRESH_MS = 4.32e7; // 12 hours

export class MuteScheduler {
	private timeouts: Map<NodeJS.Timeout, DocumentType<Case>>;
	client: MinehutClient;

	constructor(client: MinehutClient) {
		this.timeouts = new Map();
		this.client = client;
	}

	async refresh() {
		this.timeouts.forEach((_c, t) => clearTimeout(t));
		// This query will find [voice]mutes that are expiring within 3 days
		const mutesExpiringSoon = await CaseModel.find({
			$or: [{ type: CaseType.Mute }, { type: CaseType.VoiceMute }],
			expiresAt: { $lte: new Date(Date.now() + EXPIRING_SOON_MS) },
			active: true,
		});
		mutesExpiringSoon.forEach(c => {
			const timeout = setTimeout(
				() => this.unmute(c),
				c.expiresAt.getTime() - Date.now()
			);
			this.timeouts.set(timeout, c);
		});
		setTimeout(() => this.refresh(), REFRESH_MS);
	}

	async unmute(c: DocumentType<Case>) {
		// unmute user here
		console.log('UNMUTE', c.targetTag);
		const guild = this.client.guilds.cache.get(c.guildId);
		if (!guild)
			return console.log(
				`on mute scheduler unmute, could not find guild ${c.guildId}`
			);
		const member = guild.member(c.targetId);
		if (!member)
			return console.log(`on mute scheduler unmute, member is not in guild`);
		if (c.type === CaseType.Mute) member.roles.remove(guildConfigs.get(c.guildId)!.roles.muted!);
		else if (c.type === CaseType.VoiceMute) member.voice.setMute(false);
		await c.updateOne({ active: false });
	}
}
