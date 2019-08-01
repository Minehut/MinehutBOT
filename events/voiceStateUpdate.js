module.exports = {
    run: async (client, memberb, membera) => {
        if (memberb.voiceChannel == undefined && membera.voiceChannel != undefined) {
            const voicerole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Voice');
            membera.addRole(voicerole);
        } else if (membera.voiceChannel == undefined && memberb.voiceChannel != undefined) {
            const voicerole = client.guilds.get(client.config.guildid).roles.find(r => r.name === 'Voice');
            if (membera.roles.has(voicerole.id)) {
                membera.removeRole(voicerole);
            }
        }
    }
}