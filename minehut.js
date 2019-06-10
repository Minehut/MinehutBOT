const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const pastebin = require('pastebin-js');
const ytdl = require('ytdl-core');
client.config = require('./config.json');

client.login(client.config.token);
client.pb = new pastebin({ 'api_dev_key': 'ffe5a5a4599619d9c1a843760b89b23b', 'api_user_name': 'MinehutArchives', 'api_password': '2,ErzA^WLCAz' })
client.db = require('rethinkdbdash')({ db: 'minehut', servers: [{ host: client.config.db.host, port: client.config.db.port, user: client.config.db.user, password: client.config.db.pass }] });
module.exports = client;

fs.readdir('./events', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

client.on('raw', packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = client.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});

client.on('warn', e => {
  console.log('that was redacted');
});

client.on('error', e => {
  console.log('that was redacted');
});


function check(client) {
    setInterval(async function () {
        const punishments = await client.db.table('punishments').filter({ active: true }).run();
        punishments.forEach(p => {
            if (p.dateExpired) {
                if (p.dateExpired <= Date.now()) {
                if (p.type == 'BAN') {
                    client.db.table('punishments').get(p.id).update({ active: false }).run();
                    client.guilds.get(client.config.guildid).unban(p.punished.id);
                } else if (p.type == 'MUTE') {
                    const member = client.guilds.get(client.config.guildid).members.get(p.punished.id);
                    if (member) {
                        client.db.table('punishments').get(p.id).update({ active: false }).run();
                        client.db.table('userData').get(p.punished.id).update({ muted: false }).run();
                        member.removeRole(client.config.muterole);
                    } else {
                        client.db.table('punishments').get(p.id).update({ active: false }).run();
                        client.db.table('userData').get(p.punished.id).update({ muted: false }).run();
                    }
                }
            }
        }  
    });
}, 1000)
}

function spaminterval(client) {
    setInterval(async function() {
        const guildusers = client.guilds.get(client.config.guildid).members;
        const usersarray = guildusers.array();
        usersarray.forEach(u => {
            client.db.table('userData').get(u.id).update({ msgs: 0 }).run();
        });
    }, 3000)
}

function updateStatus(client) {
    setInterval(function() {
        const totalusers = client.users.size-1;
        client.user.setActivity(`with ${totalusers} users`, { type: 'PLAYING' });
    }, 10000)
}

check(client);
spaminterval(client);

client.elevation = msg => {
    let permlvl = 0;
    let jrmod = msg.guild.roles.find(role => role.name === 'Junior Moderator');
    if (jrmod && msg.member.roles.has(jrmod.id)) permlvl = 1;
    let mod = msg.guild.roles.find(role => role.name === 'Moderator');
    if (mod && msg.member.roles.has(mod.id)) permlvl = 2;
    let srmod = msg.guild.roles.find(role => role.name === 'Senior Moderator');
    if (srmod && msg.member.roles.has(srmod.id)) permlvl = 3;
    let admin = msg.guild.roles.find(role => role.name === 'Administrator');
    if (admin && msg.member.roles.has(admin.id)) permlvl = 4;
    if (client.config.devs.indexOf(msg.author.id) > -1) permlvl = 5;
    return permlvl;
}

client.checkPerms = (msg, member) => {
    let punishable;
    let jrmod = msg.guild.roles.find(role => role.name === 'Junior Moderator');
    if (jrmod && member.roles.has(jrmod.id)) punishable = false;
    let mod = msg.guild.roles.find(role => role.name === 'Moderator');
    if (mod && member.roles.has(mod.id)) punishable = false;
    let srmod = msg.guild.roles.find(role => role.name === 'Senior Moderator');
    if (srmod && member.roles.has(srmod.id)) punishable = false;
    let admin = msg.guild.roles.find(role => role.name === 'Administrator');
    if (admin && member.roles.has(admin.id)) punishable = false;
    return punishable; 
}

client.getTime = () => {
    const date = new Date();
    const time = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
    return time;
}

client.log = msg => {
    client.channels.get(client.config.logchannel).send(`\`${client.getTime()}\` ${msg}`);
}