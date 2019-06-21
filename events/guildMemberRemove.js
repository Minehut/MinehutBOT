module.exports = { 
    run: async (client, member) => {
        if (member.guild.id === client.config.staffguild) {
            client.log(`\`[STAFF]\` :outbox_tray: ${member.user.tag} (\`${member.id}\`) left the server`);
        } else {
            client.log(`:outbox_tray: ${member.user.tag} (\`${member.id}\`) left the server`);
        }
    }
}