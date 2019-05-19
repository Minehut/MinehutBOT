module.exports = { 
    run: async (client, member) => {
        client.log(`:outbox_tray: ${member.user.tag} (\`${member.id}\`) left the server`);
    }
}