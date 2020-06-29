import { Listener } from 'discord-akairo';
import { CaseModel } from '../../../model/case';
import { CaseType } from '../../../util/constants';
import { Guild } from 'discord.js';
import { User } from 'discord.js';
import { UnBanAction } from '../../../structure/action/unBan';

export default class UnBanByRevokeListener extends Listener {
	constructor() {
		super('unBanByRevoke', {
			emitter: 'client',
			event: 'guildBanRemove',
		});
	}

	async exec(guild: Guild, user: User) {
		// Stop the flow if the member is not banned
		if (
			!(await CaseModel.exists({
				targetId: user.id,
				$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
				active: true,
				guildId: guild.id,
			}))
		)
			return;
		const action = new UnBanAction({
			target: user,
			moderator: guild.member(this.client.user!)!,
			reason: `Manual ban revoke`,
			client: this.client,
			guild,
		});
		action.commit();
	}
}
