module.exports = {
    run: async (client, msg, args) => {
        const members = msg.guild.members;
        members.forEach(async member => {
            const user = await client.db.table('userData').get(member.id).run();
            if (!user) {
                const muted = msg.guild.roles.find(r => r.name === 'Muted');
                if (member.roles.has(muted.id)) {
                    client.db.table('userData').insert({ id: member.id, muted: true, msgs: 0 }).run();
                } else {
                    client.db.table('userData').insert({ id: member.id, muted: false, msgs: 0 }).run();
                }
            }
        });
        msg.channel.send(':ok_hand: done');
    },
    meta: {
        aliases: ['initialize'],
        description: '',
        permlvl: 5,
        usage: ''              
    }
}