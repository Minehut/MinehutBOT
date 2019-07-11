module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must include the ID of the punishment you\'d like to remove!');
        const id = parseInt(args[0]);
        if (id == NaN) return msg.channel.send(':x: ID is not a number!');
        const pun = await client.db.table('punishments').get(id).run();
        if (!pun) return msg.channel.send(':x: A punishment with that ID doesn\'t exist!');
        if (pun.active) return msg.channel.send(':x: This punishment is an active punishment! Pardon the user that this infraction affected before trying to remove the punishment.');
        client.db.table('punishments').get(id).delete().run();
        msg.channel.send(`:ok_hand: deleted an inf (\`${id}\`)`);
    },
    meta: {
        aliases: ['remove'],
        description: 'Remove an infraction',
        permlvl: 4,
        modCmd: true,
        usage: ''  
    }
}