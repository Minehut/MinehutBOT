import { Listener } from 'discord-akairo';
import { CaseModel } from '../../../model/case';
import { CaseType, FOREVER_MS } from '../../../util/constants';
import { BanAction } from '../../../structure/action/ban';
import { GuildBan } from 'discord.js';

export default class BanByManualBan extends Listener {
	constructor() {
		super('banByManualBan', {
			emitter: 'client',
			event: 'guildBanAdd',
		});
	}

	async exec(ban: GuildBan) {
		setTimeout(async () => {
			// Stop flow if user is not banned anymore (probably softban)
			const bans = await ban.guild.bans.fetch();
			if (!bans.has(ban.user.id)) return;
			// Stop the flow if the member has a ban case
			if (
				await CaseModel.exists({
					targetId: ban.user.id,
					$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
					active: true,
					guild: ban.guild.id,
				})
			)
				return;
			const action = new BanAction({
				target: ban.user,
				moderator: ban.guild.members.resolve(this.client.user!)!,
				reason: `Manual ban`,
				duration: FOREVER_MS,
				client: this.client,
				guild: ban.guild,
			});
			action.commit();
		}, 3000);
	}
}
