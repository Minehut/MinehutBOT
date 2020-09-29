import { MinehutCommand } from "../../structure/command/minehutCommand";
import { Message, GuildMember } from "discord.js";
import { guildConfigs } from "../../guild/config/guildConfigs";
import { BoosterPassModel } from "../../model/boosterPass";
import { MessageEmbed } from "discord.js";

export default class BoosterInfoCommand extends MinehutCommand {

    constructor() {
        super('boosterpass-info', {
            category: 'boosterpass',
            channel: 'guild',
            description: {
                content: 'Look up the booster passes of a member',
                usage: '<member>',
                examples: [
                    'boosterpass info @Facto',
                    'boosterpass info 535986058991501323'
                ]
            },
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => 
                            `${msg.author}, whose booster passes should I look up?`,
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

        if (!boosterPassConfiguration)
            return msg.channel.send(`${process.env.EMOJI_CROSS} Booster passes not enabled in configuration!`);

        const boosterPasses = await BoosterPassModel.getGrantedByMember(member, 15);
        const mappedBoosterPasses = boosterPasses.map(bp => `• <@${bp.grantedId}>`);

        const receivedBoosterPasses = await BoosterPassModel.getReceivedByMember(member, 15);
        const mappedReceivedBoosterPasses = receivedBoosterPasses.map(bp => `• <@${bp.granterId}>`);

        if (boosterPasses.length <= 0 && receivedBoosterPasses.length <= 0)
            return msg.channel.send(`${process.env.EMOJI_CROSS} This member doesn't have any booster passes nor have they given any!`);

        const embed = new MessageEmbed()
            .setAuthor(
                `${member.user.tag}'s Booster Passes`, 
                member.user.displayAvatarURL()
            )
            .addField(
                'Received From', 
                mappedReceivedBoosterPasses.length > 0 ? mappedReceivedBoosterPasses.join('\n') : 'None', 
                true
            )
            .addField(
                'Given To', 
                mappedBoosterPasses.length > 0 ? mappedBoosterPasses.join('\n') : 'None', 
                true
            )
            .setColor('BLURPLE');
        return msg.channel.send(embed);
    }

}