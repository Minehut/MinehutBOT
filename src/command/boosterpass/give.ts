import { MinehutCommand } from "../../structure/command/minehutCommand"
import { PermissionLevel } from "../../util/permission/permissionLevel"
import { Message } from "discord.js";
import { GuildMember } from "discord.js";
import { guildConfigs } from "../../guild/config/guildConfigs";
import { BoosterPass, BoosterPassModel } from "../../model/boosterPass";

export default class BoosterPassGiveCommand extends MinehutCommand {

    constructor() {
        super('boosterpass-give', {
            permissionLevel: PermissionLevel.NitroBooster,
            // Only nitro boosters can give booster passes
            enforcePermissionLevelRole: true,
            category: 'boosterpass',
            channel: 'guild',
            description: {
                content: 'Give a member a booster pass',
                usage: '<member>',
                examples: [
                    'boosterpass give @Facto',
                    'boosterpass give 535986058991501323'
                ]
            },
            clientPermissions: ['MANAGE_ROLES'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => 
                            `${msg.author}, who do you want to give the booster pass to?`,
                        retry: (msg: Message) => 
                            `${msg.author}, please mention a member.`
                    }
                }
            ]
        });
    }

    async exec(
        msg: Message,
        { member }: { member: GuildMember }
    ) {
        const boosterPassConfiguration = guildConfigs
            .get(msg.guild!.id)?.features.boosterPass;

        const nitroBoosterRole = guildConfigs
            .get(msg.guild!.id)?.roles.nitroBooster;
        const boosterPassRole = guildConfigs
            .get(msg.guild!.id)?.roles.boostersPass;

        if (!boosterPassConfiguration)
            return msg.channel.send(`${process.env.EMOJI_CROSS} Booster passes not enabled in configuration!`);
        
        if (!nitroBoosterRole || !boosterPassRole)
            throw new Error('Booster pass roles not configured in guild config');

        if (member == msg.member)
            return msg.channel.send(`${process.env.EMOJI_CROSS} You cannot give a booster pass to yourself!`);

        const boosterPasses = await BoosterPassModel.getBoosterPasses(msg.member!);

        if (boosterPasses.length == (boosterPassConfiguration.maximumGrantedBoosterPasses || 2))
            return msg.channel.send(`${process.env.EMOJI_CROSS} You cannot give anymore booster passes!`);
        if (boosterPasses.find(b => b.grantedId === member.id))
            return msg.channel.send(`${process.env.EMOJI_CROSS} You already have given this member a booster pass!`);

        const boosterPass = {
            granterId: msg.author.id,
            granterTag: msg.author.tag,
            grantedId: member.id,
            grantedTag: member.user.tag,
            guild: msg.guild!.id
        } as BoosterPass;

        await BoosterPassModel.create(boosterPass);
        if (!member.roles.cache.has(boosterPassRole))
            await member.roles.add(boosterPassRole);
        return msg.channel.send(`${process.env.EMOJI_CHECK} gave **${member.user.tag}** a booster pass`);
    }

}