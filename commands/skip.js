module.exports = {
    run: async (client, msg, args) => {
        const queue = await client.db.table('musicData').get('queue').run();
        const tracks = queue.tracks;
        if (tracks.length == 0) return msg.channel.send(':x: There are no songs queued, so you can\'t skip any songs!');
        const channel = msg.guild.voiceConnection.channel;
        client.musicFinish(client, channel, 'SKIP' );
        msg.react('👌');
    },
    meta: {
        aliases: ['skip'],
        description: 'Skip the current song',
        permlvl: 1,
        usage: ''
    }
}