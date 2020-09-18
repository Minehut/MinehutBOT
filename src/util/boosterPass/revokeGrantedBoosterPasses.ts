import { GuildMember } from "discord.js";
import { guildConfigs } from "../../guild/config/guildConfigs";
import { BoosterPassModel } from "../../model/boosterPass";

export default async function revokeGrantedBoosterPasses(member: GuildMember) {
    const boosterPasses = await BoosterPassModel.getBoosterPasses(member);
    if (boosterPasses.length > 0) 
        boosterPasses.forEach(async bp => {
            await bp.remove();
            const boosterPassRole = guildConfigs
                .get(member.guild.id)?.roles.boostersPass;
            if (!boosterPassRole)
                throw new Error(`Guild ${member.guild.id} does not have a configured booster pass role!`);
            const boosterPassReceiver = await member.guild.members.fetch(bp.grantedId);
            if (!boosterPassReceiver) return;
            const receiverReceivedPasses = await BoosterPassModel.getGrantedBoosterPasses(boosterPassReceiver);
            if (
                receiverReceivedPasses.length < 0 &&
                boosterPassReceiver.roles.cache.has(boosterPassRole)
            )
                boosterPassReceiver.roles.remove(boosterPassRole);
        });
        
}