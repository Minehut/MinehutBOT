module.exports = {
    run: async (client, member) => {
        client.log(`:inbox_tray: ${member.user.tag} (\`${member.id}\`) joined`);
        const user = await client.db.table('userData').get(member.id).run();
        if (user) {
            if (user.muted == true) {
                const muted = client.guilds.get(client.config.guildid).roles.find(role => role.name === 'Muted');
                member.addRole(muted);
            } 
        } else {
            client.db.table('userData').insert({ id: member.id, muted: false }).run();
        }
    }
}