module.exports = {
    run: async (client) => {
        console.log(`Ready as ${client.user.tag}`);
        const totalusers = client.users.size-1;
        client.user.setActivity(`with ${totalusers} users`, { type: 'PLAYING' });
    }
}