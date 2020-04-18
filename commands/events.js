module.exports = {
    run: async (client, msg, args) => {
        if (args.length < 1) return msg.channel.send(':x: Correct usage: `events <yes/no> <message>');
        const mentionArg = args[0];
        args.shift();
        if (!['yes', 'y', 'no', 'n'].includes(mentionArg.toLowerCase())) return msg.reply('First argument must be `yes/no` -- do you want to mention the Events role?');
        const mention = ['yes', 'y'].includes(mentionArg.toLowerCase()) ? true : false;
        const message = args.join(' ');
        if (!message) return msg.channel.send(':x: You must supply a message to announce in the events channel!');
        const events = client.channels.get(client.config.eventschannel);
        const eventsrole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Events');
        if (mention) {
            await eventsrole.setMentionable(true);
            await events.send(`${message}\n\n<@&${eventsrole.id}>`);
            await eventsrole.setMentionable(false);
        } else if (!mention) {
            await events.send(`${message}`);
        }
    },
    meta: {
        aliases: ['events'],
        description: 'Announce an event',
        permlvl: 3,
        modCmd: false,
        usage: ''
    }
}