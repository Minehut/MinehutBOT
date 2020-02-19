module.exports = {
    run: async (client, msg, args) => {
        const message = args.join(' ');
        if (!message) return msg.channel.send(':x: You must supply a message to announce in the events channel!');
        const events = client.channels.get(client.config.eventschannel);
        const eventsrole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Events');
        const awaitM = async () => {
            const filter = m => m.author.id === msg.author.id;
            const c = await msg.channel.awaitMessages(filter, { max: 1, time: 60000 * 5, errors: ['time'] })
            return c;
        }
        msg.channel.send('Would you like to tag the events role? (y/n)');
        m = await awaitM();
        if (m.first().content.toLowerCase() == 'y') {
            await eventsrole.setMentionable(true);
            await events.send(`${message}\n\n<@&${eventsrole.id}>`);
            await eventsrole.setMentionable(false);    
        } else if (m.first().content.toLowerCase() == 'n') {
            await events.send(`${message}`);
        } else {
            msg.channel.send(':x: Invalid response, defaulting to `n`');
            await events.send(`${message}`);
        }
    },
    meta: {
        aliases: ['events'],
        description: 'Announce an event',
        permlvl: 4,
        modCmd: false,
        usage: ''              
    }
}