import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { BoosterPassModel } from '../../model/boosterPass';
import { sendModLogMessage } from '../../util/functions';

export default class ModLogBoosterPassRevokeListener extends Listener {
	constructor() {
		super('modLogBoosterPassRevokeListener', {
			emitter: 'client',
			event: 'boosterPassRevoke',
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
			`${granter.user.tag} (\`${granter.id}\`) revoked a booster pass from ${
				receiver.user.tag
			} (\`${receiver.id}\`) (${grantedBoosterPasses.length}/${
				boosterPassConfig.maximumGrantedBoosterPasses || 2
			})`
		);
	}
}