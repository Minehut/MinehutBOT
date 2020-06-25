import { CaseModel, Case } from '../../model/case';
import { CaseType } from '../../util/constants';
import { DocumentType } from '@typegoose/typegoose';
import { MinehutClient } from '../../client/minehutClient';
import { UnBanAction } from '../action/unBan';

const EXPIRING_SOON_MS = 2.592e8; // 3 days
const REFRESH_MS = 4.32e7; // 12 hours

export class BanScheduler {
	private timeouts: Map<NodeJS.Timeout, DocumentType<Case>>;
	client: MinehutClient;

	constructor(client: MinehutClient) {
		this.timeouts = new Map();
		this.client = client;
	}

	async refresh() {
		this.timeouts.forEach((_c, t) => clearTimeout(t));
		// This query will find bans/forcebans that are expiring within 3 days
		const bansExpiringSoon = await CaseModel.find({
			$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
			expiresAt: { $lte: new Date(Date.now() + EXPIRING_SOON_MS) },
			active: true,
		});
		bansExpiringSoon.forEach(c => {
			const timeout = setTimeout(
				() => this.unban(c),
				c.expiresAt.getTime() - Date.now()
			);
			this.timeouts.set(timeout, c);
		});
		setTimeout(() => this.refresh(), REFRESH_MS);
	}

	async unban(c: DocumentType<Case>) {
		// unban user here
		console.log('UNBAN', c.targetTag);
		const guild = this.client.guilds.cache.get(c.guildId);
		if (!guild) return;
		const user = await this.client.users.fetch(c.targetId);
		if (!user) return;
		const action = new UnBanAction({
			target: user,
			moderator: guild.member(this.client.user!)!,
			reason: `Automatic unban (#${c.id})`,
		});
		action.commit();
	}
}