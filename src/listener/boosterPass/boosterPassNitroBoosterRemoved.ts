import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { BoosterPassModel } from '../../model/boosterPass';

export default class BoosterPassNitroBoosterRemoved extends Listener {
	constructor() {
		super('boosterPassNitroBoosterRemoved', {
			emitter: 'client',
			event: 'guildMemberUpdate',
		});
	}

	async exec(oMember: GuildMember, nMember: GuildMember) {
		const config = guildConfigs.get(nMember.guild.id);
		if (!config || !config.features.boosterPass) return;
		const nitroBoosterRole = config.roles.nitroBooster;
		if (!nitroBoosterRole) return;
		if (
			oMember.roles.cache.has(nitroBoosterRole) &&
			!nMember.roles.cache.has(nitroBoosterRole)
		)
			await BoosterPassModel.removeAllGrantedByMember(nMember);
	}
}
