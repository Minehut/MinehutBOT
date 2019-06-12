module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must mention who you want to unmute.');
        let user;
        let data;
        if (msg.mentions.users.size > 0) {
            user = msg.mentions.users.first();
            data = await client.db.table('userData').get(user.id).run();
        } else {
            user = client.users.get(args[0]);
            data = await client.db.table('userData').get(args[0]).run();
        } 
        if (!user && !data) return msg.channel.send(':x: Invalid user!');
        const member = (await msg.guild.fetchMembers()).members.get(user.id);
        if (member) {
            const muted = msg.guild.roles.find(role => role.name === 'Muted');
            if (!member.roles.has(muted.id)) return msg.channel.send(':x: User isn\'t muted!');
            const punishment = await client.db.table('punishments').filter({ punished: { id: user.id }, active: true, type: 'MUTE' }).run();
            if (punishment.length == 0) {
                member.removeRole(muted);
                msg.channel.send(`:ok_hand: unmuted ${user.tag}`);
            } else {
                client.db.table('punishments').get(punishment[0].id).update({ active: false }).run();
                client.db.table('userData').get(user.id).update({ muted: false }).run();
                member.removeRole(muted);
                msg.channel.send(`:ok_hand: unmuted ${user.tag}`);
            }
        } else {
            if (data.muted == false) return msg.channel.send(':x: User isn\'t muted!');
            const punishment = await client.db.table('punishments').filter({ punished: { id: args[0] }, active: true, type: 'MUTE' }).run();
            client.db.table('punishments').get(punishment[0].id).update({ active: false }).run();
            client.db.table('userData').get(args[0]).update({ muted: false }).run();
            msg.channel.send(`:ok_hand: unmuted user with id ${args[0]}`);
        }
    },
    meta: {
        aliases: ['unmute'],
        description: 'Unmutes a user for a specified reason',
        permlvl: 1,
        usage: ''           
    }
}