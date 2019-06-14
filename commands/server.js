const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You need to specify a server name to look up!');
        const m = await msg.channel.send('Fetching the server...');
        const get = await fetch(`https://api.minehut.com/server/${args[0]}?byName=true`);
        if (get.status != 200) return m.edit(':x: Couldn\'t get the server!');
        const data = await get.json();
        const date = new Date(data.server.last_online);
        function checkEmptyStrings(string) {
            let newstring;
            if (string == '') {
                newstring = 'None';
            } else newstring = string;
            return newstring;
        }
        const embed = new Discord.RichEmbed()
        embed.setDescription(`Showing server data for ${data.server.name}`)
        embed.addField('Name', data.server.name)
        embed.addField('MOTD', data.server.motd)
        embed.addField('Visible?', data.server.visibility)
        embed.addField('Credits per Day', `${data.server.credits_per_day} (${data.server.server_properties.max_players} player slots)`)
        embed.addField('Last Online', date.toString())
        embed.addBlankField()
        embed.addField('Resource Pack', checkEmptyStrings(data.server.server_properties.resource_pack), true)
        embed.addField('Level Name', data.server.server_properties.level_name, true)
        embed.addField('Command Blocks', data.server.server_properties.enable_command_block, true)
        embed.addField('Level Seed', checkEmptyStrings(data.server.server_properties.level_seed), true)
        embed.addField('PvP', data.server.server_properties.pvp, true)
        embed.addField('Hardcore', data.server.server_properties.hardcore, true)
        embed.addField('Level Type', data.server.server_properties.level_type, true)
        embed.addField('Gamemode', data.server.server_properties.gamemode, true)
        embed.addField('Spawn Mobs', data.server.server_properties.spawn_mobs, true)
        embed.addField('Spawn Animals', data.server.server_properties.spawn_animals, true)
        embed.addField('Allow Flight', data.server.server_properties.allow_flight, true)
        embed.addField('Announce Achievements', data.server.server_properties.announce_player_achievements, true)
        embed.addField('Allow Nether', data.server.server_properties.allow_nether, true)
        embed.addField('Generate Structures', data.server.server_properties.generate_structures, true)
        embed.addField('Suspended', data.server.suspended, true)
        embed.setColor('BLUE')
        embed.setFooter(`Requested by ${msg.author.tag} | ${msg.author.id}`, msg.author.avatarURL);
        m.edit(embed);
    },
    meta: {
        aliases: ['server'],
        description: '',
        permlvl: 0,
        usage: ''          
    }
}