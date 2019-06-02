module.exports = {
    run: async (client, msg, args) => {
        msg.channel.send('it worked');
    },
    meta: {
        aliases: ['test'],
        description: 'tEsT',
        permlvl: 5,
        usage: ''  
    }
}