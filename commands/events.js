module.exports = {
    run: async (client, msg, args) => {
        const message = args.join(' ');
        if (!message) return msg.channel.send(':x: You must supply a message to announce in the events channel!');
        const events = client.channels.get(client.config.eventschannel);
        const eventsrole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Events');
        await eventsrole.setMentionable(true);
        await events.send(`${message}\n\n<@&${eventsrole.id}>`);
        await eventsrole.setMentionable(false);
    },
    meta: {
        aliases: ['events'],
        description: 'Announce an event',
        permlvl: 3,
        modCmd: false,
        usage: ''              
    }
}