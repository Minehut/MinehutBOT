import { Listener } from 'discord-akairo';
import { CaseModel } from '../../../model/case';
import { CaseType, FOREVER_MS } from '../../../util/constants';
import { BanAction } from '../../../structure/action/ban';
import { Guild } from 'discord.js';
import { User } from 'discord.js';

export default class BanByManualBan extends Listener {
	constructor() {
		super('banByManualBan', {
			emitter: 'client',
			event: 'guildBanAdd',
		});
	}

	async exec(guild: Guild, user: User) {
		setTimeout(async () => {
			// Stop flow if user is not banned anymore (probably softban)
			const bans = await guild.fetchBans();
			if (!bans.has(user.id)) return;
			// Stop the flow if the member has a ban case
			if (
				await CaseModel.exists({
					targetId: user.id,
					$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
					active: true,
					guild: guild.id,
				})
			)
				return;
			const action = new BanAction({
				target: user,
				moderator: guild.member(this.client.user!)!,
				reason: `Manual ban`,
				duration: FOREVER_MS,
				client: this.client,
				guild: guild,
			});
			action.commit();
		}, 3000);
	}
}
