module.exports = {
    run: async (client, msg, args) => {
        const members = (await msg.guild.fetchMembers()).members;
        const muted = await msg.guild.roles.find(r => r.name === 'Muted');
        members.forEach(async member => {
            const user = await client.db.table('userData').get(member.id).run();
            if (!user) {
                client.db.table('userData').insert({id: member.id,
                    user: {
                        id: member.id,
                        tag: member.user.tag,
                        username: member.user.username,
                        avatarURL: member.user.avatarURL
                    },
                    muted: member.roles.has(muted.id),
                    msgs: 0
                }).run();
            }
        });
        msg.channel.send(':ok_hand: done');
    },
    meta: {
        aliases: ['initialize'],
        description: '',
        permlvl: 6,
        modCmd: false,
        usage: ''
    }
}