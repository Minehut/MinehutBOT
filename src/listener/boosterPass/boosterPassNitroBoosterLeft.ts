import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { guildConfigs } from "../../guild/config/guildConfigs";
import { BoosterPassModel } from "../../model/boosterPass";

export default class BoosterPassNitroBoosterLeftListener extends Listener {
    constructor() {
        super('boosterPassNitroBoosterLeft', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    async exec(member: GuildMember) {
        const boosterPassConfiguration = guildConfigs
            .get(member.guild.id)?.features.boosterPass;
        
        if (boosterPassConfiguration) 
            await BoosterPassModel.removeAllGrantedByMember(member);
    }

}