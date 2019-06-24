module.exports = {
    run: async (client, member) => {
        if (member.guild.id === client.config.staffguild) {
            client.log(`\`[STAFF]\` :inbox_tray: ${member.user.tag} (\`${member.id}\`) joined`);
        } else {
            client.log(`:inbox_tray: ${member.user.tag} (\`${member.id}\`) joined`);
        }
        const user = await client.db.table('userData').get(member.id).run();
        if (user) {
            if (user.muted == true) {
                const muted = client.guilds.get(client.config.guildid).roles.find(role => role.name === 'Muted');
                member.addRole(muted);
            } 
        } else {
            client.db.table('userData').insert({ id: member.id, user: { id: member.id, tag: member.user.tag, username: member.user.username, avatarURL: member.user.avatarURL }, muted: false, msgs: 0 }).run();
        }
    }
}