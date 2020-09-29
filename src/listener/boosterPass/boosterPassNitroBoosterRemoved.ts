import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { guildConfigs } from "../../guild/config/guildConfigs";
import { BoosterPassModel } from "../../model/boosterPass";

export default class BoosterPassNitroBoosterRemovedListener extends Listener {
    constructor() {
        super('boosterPassNitroBoosterRemoved', {
            emitter: 'client',
            event: 'guildMemberUpdate'
        });
    }

    async exec(oMember: GuildMember, nMember: GuildMember) {
        const boosterPassConfiguration = guildConfigs
            .get(nMember.guild.id)?.features.boosterPass;
        if (boosterPassConfiguration) {
            const nitroBoosterRole = guildConfigs
                .get(nMember.guild.id)?.roles.nitroBooster;
            if (!nitroBoosterRole) return;
            if (
                oMember.roles.cache.has(nitroBoosterRole) &&
                !nMember.roles.cache.has(nitroBoosterRole)
            )
                await BoosterPassModel.removeGrantedBoosterPasses(nMember);
        } 
    }
}