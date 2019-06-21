const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        const m = await msg.channel.send('Fetching Minehut stats...');
        const get_stats = await fetch('https://api.minehut.com/network/simple_stats');
        const simple_stats = await get_stats.json();
        const get_player_dist = await fetch('https://api.minehut.com/network/players/distribution');
        const player_dist = await get_player_dist.json();
        function getRoundedRam(ram) {
            let tb;
            tb = ram / 1000;
            return tb;
        }
        const embed = new Discord.RichEmbed()
        embed.addField('Online Players', simple_stats.player_count)
        embed.addField('Server Count', `${simple_stats.server_count}/${simple_stats.server_max}`)
        embed.addField('RAM Usage', `${getRoundedRam(simple_stats.ram_count)}/${simple_stats.ram_max} GB`)
        embed.addField('Players in Servers', `${player_dist.player_server}`)
        embed.addField('Players in Lobbies', `${player_dist.lobby}`)
        embed.setFooter(`Requested by ${msg.author.tag} | ${msg.author.id}`, msg.author.avatarURL)
        embed.setColor('BLUE');
        m.edit(embed);
    },
    meta: {
        aliases: ['stats'],
        description: '',
        permlvl: 0,
        modCmd: false,
        usage: ''          

    }
}