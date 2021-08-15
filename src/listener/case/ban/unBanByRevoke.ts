import { Listener } from 'discord-akairo';
import { CaseModel } from '../../../model/case';
import { CaseType } from '../../../util/constants';
import { GuildBan } from 'discord.js';
import { UnBanAction } from '../../../structure/action/unBan';

export default class UnBanByRevokeListener extends Listener {
	constructor() {
		super('unBanByRevoke', {
			emitter: 'client',
			event: 'guildBanRemove',
		});
	}

	async exec(ban: GuildBan) {
		// Stop the flow if the member is not banned
		if (
			!(await CaseModel.exists({
				targetId: ban.user.id,
				$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
				active: true,
				guild: ban.guild.id,
			}))
		)
			return;
		const action = new UnBanAction({
			target: ban.user,
			moderator: ban.guild.members.resolve(this.client.user!)!,
			reason: `Manual ban revoke`,
			client: this.client,
			guild: ban.guild,
		});
		action.commit();
	}
}
