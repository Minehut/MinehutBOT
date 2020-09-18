import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { guildConfigs } from "../../../guild/config/guildConfigs";
import revokeGrantedBoosterPasses from "../../../util/boosterPass/revokeGrantedBoosterPasses";

export default class NitroBoosterRemoved extends Listener {
    constructor() {
        super('nitroBoosterRemoved', {
            emitter: 'client',
            event: 'guildMemberUpdate'
        });
    }

    async exec(oMember: GuildMember, nMember: GuildMember) {
        const boosterPassConfiguration = guildConfigs
            .get(nMember.guild.id)?.features.boosterPass;
    
        if (boosterPassConfiguration && boosterPassConfiguration.active) {
            const nitroBoosterRole = guildConfigs
                .get(nMember.guild.id)?.roles.nitroBooster;
            if (!nitroBoosterRole) return;
            if (
                oMember.roles.cache.has(nitroBoosterRole) &&
                !nMember.roles.cache.has(nitroBoosterRole)
            )
                await revokeGrantedBoosterPasses(nMember);
        } 

    }
}