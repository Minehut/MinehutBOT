import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { guildConfigs } from "../../../guild/config/guildConfigs";
import revokeGrantedBoosterPasses from "../../../util/boosterPass/revokeGrantedBoosterPasses";

export default class NitroBoosterLeft extends Listener {
    constructor() {
        super('nitroBoosterLeft', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    async exec(member: GuildMember) {
        const boosterPassConfiguration = guildConfigs
            .get(member.guild.id)?.features.boosterPass;
        
        if (boosterPassConfiguration && boosterPassConfiguration.active) 
            await revokeGrantedBoosterPasses(member);
    }

}