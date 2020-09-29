import { CaseModel, Case } from '../../model/case';
import { CaseType } from '../../util/constants';
import { DocumentType } from '@typegoose/typegoose';
import { MinehutClient } from '../../client/minehutClient';
import { UnMuteAction } from '../action/unMute';

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
			const expiredDuration = c.expiresAt.getTime() - Date.now();
			if (expiredDuration > 0) {
				const timeout = setTimeout(() => this.unmute(c), expiredDuration);
				this.timeouts.set(timeout, c);
			} else {
				this.unmute(c);
			}
		});
		setTimeout(() => this.refresh(), REFRESH_MS);
	}

	async unmute(c: DocumentType<Case>) {
		const guild = this.client.guilds.cache.get(c.guild);
		if (!guild) return;
		const member = guild.member(c.targetId);
		if (!member) return;
		if (c.type === CaseType.Mute) {
			const action = new UnMuteAction({
				target: member,
				moderator: guild.member(this.client.user!)!,
				reason: `Automatic unmute (#${c.id})`,
				client: this.client,
				guild,
			});
			action.commit();
		} else if (c.type === CaseType.VoiceMute) {
			// unvoicemute
		}
	}
}
