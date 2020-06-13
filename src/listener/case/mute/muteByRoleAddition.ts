import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../../guild/guildConfigs';
import { CaseModel } from '../../../model/case';
import { CaseType, FOREVER_MS } from '../../../util/constants';
import { MuteAction } from '../../../structure/action/mute';

export default class MuteByRoleAdditionListener extends Listener {
	constructor() {
		super('muteByRoleAddition', {
			emitter: 'client',
			event: 'guildMemberUpdate',
		});
	}

	async exec(oldMember: GuildMember, newMember: GuildMember) {
		const mutedRole = guildConfigs.get(newMember.guild.id)?.roles.muted;
		if (!mutedRole) return;
		if (
			!oldMember.roles.cache.has(mutedRole) &&
			newMember.roles.cache.has(mutedRole)
		) {
			setTimeout(async () => {
				// Stop the flow if the member is muted
				if (
					await CaseModel.exists({
						targetId: newMember.id,
						type: CaseType.Mute,
						active: true,
						guildId: newMember.guild.id,
					})
				)
					return;
				const action = new MuteAction({
					target: newMember,
					moderator: newMember.guild.member(this.client.user!)!,
					reason: `Manual role addition`,
					duration: FOREVER_MS,
					client: this.client,
				});
				action.commit();
			}, 3000);
		}
	}
}
