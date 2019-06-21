module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must specify a tag you would like to delete!');
        const command = args[0].toLowerCase();
        const tag = await client.db.table('tags').get(command).run();
        if (!tag) return msg.channel.send(':x: There is no tag by that name!');
        client.db.table('tags').delete(command).run();
        msg.channel.send(`:ok_hand: deleted a tag (\`${command}\`)`);
    },
    meta: {
        aliases: ['tagdel'],
        description: '',
        permlvl: 1,
        modCmd: false,
        usage: ''          
    }
}