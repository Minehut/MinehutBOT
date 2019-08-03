module.exports = {
    run: async (client, memberb, membera) => {
        const facto = client.users.get('535986058991501323'); // hard coding because this is going to be removed within a day
        if (memberb.voiceChannel == undefined && membera.voiceChannel != undefined) {
            facto.send(`${membera.user.tag} has joined a channel!`);
            const voicerole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Voice');
            await membera.addRole(voicerole);
            facto.send(`${membera.user.tag} has gotten the voice role!`);
        } else if (membera.voiceChannel == undefined && memberb.voiceChannel != undefined) {
            facto.send(`${membera.user.tag} has left a channel!`);
            const voicerole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Voice');
            await membera.removeRole(voicerole);
            facto.send(`${membera.user.tag} has gotten their voice role removed!`);
        }
    }
}