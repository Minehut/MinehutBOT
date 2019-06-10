module.exports = {
    run: async (client, guild) => {
        guild.members.forEach(member => {
            const user = await client.db.table('userData').get(member.id).run();
            if (!user) {
                const muted = guild.roles.find(r => r.name === 'Muted');
                if (member.roles.has(muted.id)) {
                    client.db.table('userData').insert({ id: member.id, muted: true, msgs: 0 }).run();
                } else {
                    client.db.table('userData').insert({ id: member.id, muted: false, msgs: 0 }).run();
                }
            }
        });
    }
}