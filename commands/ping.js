module.exports = {
    run: async (client, msg, args) => {
        msg.channel.send(`Pong! \`${~~client.ping}ms\``);
    },
    meta: {
        aliases: ['ping'],
        description: 'Pings the bot',
        permlvl: 0,
        modCmd: false,
        usage: ''
    }
}