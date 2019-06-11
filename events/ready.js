module.exports = {
    run: async (client) => {
        console.log(`Ready as ${client.user.tag}`);
        client.user.setActivity(`with ${client.guilds.get(client.config.guildid).memberCount} users`, { type: 'PLAYING' });    }
}