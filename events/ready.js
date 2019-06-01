module.exports = {
    run: async (client) => {
        console.log(`Ready as ${client.user.tag}`);
        client.user.setActivity(`with ${client.users.size} users`, { type: 'PLAYING' });
    }
}