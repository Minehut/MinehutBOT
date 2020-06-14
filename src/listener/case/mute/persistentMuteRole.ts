import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../../guild/guildConfigs';
import { CaseModel } from '../../../model/case';
import { CaseType } from '../../../util/constants';

// TODO: add mod-log here
export default class PersistentMuteRole extends Listener {
	constructor() {
		super('persistentMuteRole', {
			emitter: 'client',
			event: 'guildMemberAdd',
		});
	}

	async exec(member: GuildMember) {
		const mutedRole = guildConfigs.get(member.guild.id)?.roles.muted;
		if (!mutedRole) return;
		// If member is muted, give them the role
		if (
			await CaseModel.exists({
				targetId: member.id,
				type: CaseType.Mute,
				active: true,
				guildId: member.guild.id,
			})
		)
			member.roles.add(mutedRole);
	}
}
