module.exports = {
    run: async (client, ememberb, emembera) => {
        const memberb = await ememberb.fetch();
        const membera = await emembera.fetch();
        if (memberb.voiceChannel == undefined && membera.voiceChannel != undefined) {
            const voicerole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Voice');
            await membera.addRole(voicerole);
        } else if (membera.voiceChannel == undefined && memberb.voiceChannel != undefined) {
            const voicerole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Voice');
            await membera.removeRole(voicerole);
        }
    }
}