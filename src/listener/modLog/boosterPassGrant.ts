import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { BoosterPassModel } from '../../model/boosterPass';
import { sendModLogMessage } from '../../util/functions';

export default class ModLogBoosterPassGrantListener extends Listener {
	constructor() {
		super('modLogBoosterPassGrant', {
			emitter: 'client',
			event: 'boosterPassGrant',
		});
	}

	async exec(granter: GuildMember, receiver: GuildMember) {
		const guild = granter.guild;
		const config = guildConfigs.get(guild.id);
		const boosterPassConfig = config?.features.boosterPass;
		if (
			!config ||
			!boosterPassConfig ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('boosterPassGrant')
		)
			return;
		const grantedBoosterPasses = await BoosterPassModel.getGrantedByMember(
			granter
		);
		await sendModLogMessage(
			guild,
			`:crossed_swords: ${receiver.user.tag} (\`${
				receiver.id
			}\`) was granted a booster pass by ${granter.user.tag} (\`${
				granter.id
			}\`) (${grantedBoosterPasses.length}/${
				boosterPassConfig.maximumGrantedBoosterPasses || 2
			})`
		);
	}
}
