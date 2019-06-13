module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must give the ID of someone to unban!');
        if (args[0].length != 18) return msg.channel.send(':x: Invalid ID!');
        msg.guild.fetchBans().then(async bans => {
            const user = bans.find(user => user.id === args[0]);
            if (!user) return msg.channel.send(':x: The user isn\'t banned.');
            const punishment = await client.db.table('punishments').filter({ punished: { id: user.id }, active: true, type: 'BAN' }).run();
            if (punishment.length == 0) {
                msg.guild.unban(user.id);
                msg.channel.send(`:ok_hand: unbanned ${user.tag}`);
            } else {
                client.db.table('punishments').get(punishment[0].id).update({ active: false }).run();
                msg.guild.unban(user.id);
                msg.channel.send(`:ok_hand: unbanned ${user.tag}`);                
            }
        });
    },
    meta: {
        aliases: ['unban'],
        description: 'Unbans a user for a specified reason',
        permlvl: 1,
        usage: ''        
    }
}