import { Message } from 'discord.js'
import { MinehutCommand } from '../../structure/command/minehutCommand'

export default class GoogleCommand extends MinehutCommand {
    constructor() {
        super('google', {
            aliases: ['google'],
            description: {
                content: 'Googles a search term',
                ussage: '<query>',
                examples: ['minehut'],
            },
            category: 'info',
            args: [
                {
                    id: 'search',
                    type: 'string',
                    match: 'rest',
                }
            ]
        })
    }

    async exec(msg: Message, { search }: { search: string }) {
        msg.channel.send({ content: `https://google.com/search?q=${encodeURI(search.replace(/ /gi, '+'))}` });
    }
}
