module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must supply an ID.');
        const id = parseInt(args[0], 10);
        if (id == NaN) return msg.channel.send(':x: ID is not a number');
        const punishment = await client.db.table('punishments').get(id).run();
        if (!punishment) return msg.channel.send(':x: Invalid ID');
        const reason = args.slice(1).join(' ');
        if (!reason) return msg.channel.send(':x: You must a supply a reason for updating this infraction.');
        client.db.table('punishments').get(id).update({ reason: reason }).run();
        msg.channel.send(`:ok_hand: updated reason for inf ${id} (\`${reason}\`)`);
    },
    meta: {
        aliases: ['reason'],
        description: 'Updates a reason for an infraction',
        permlvl: 3,
        usage: ''          
    }
}