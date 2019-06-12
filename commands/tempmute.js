const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must mention who you want to tempmute.');
        let user;
        if (msg.mentions.users.size > 0) {
            user = msg.mentions.users.first();
        } else user = client.users.get(args[0]);
        if (!user) return msg.channel.send(':x: Invalid user');
        const member = (await msg.guild.fetchMembers()).memebrs.get(user.id);
        if (!args[1]) return msg.channel.send(`:x: Invalid length`);
        if (args[1].endsWith('s')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const expDate = date.setSeconds(num);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily muting ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily muted on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}s`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            user.send(embed).then(() => {
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                member.addRole(muted);
                msg.channel.send(`:ok_hand: muted ${user.tag} for ${num} second(s) (\`${reason}\`)`);  
            });      
        } else if (args[1].endsWith('m')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 60;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily muting ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily muted on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}m`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            user.send(embed).then(() => {
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                member.addRole(muted);
                msg.channel.send(`:ok_hand: muted ${user.tag} for ${num} minute(s) (\`${reason}\`)`);  
            });                  
        } else if (args[1].endsWith('h')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 3600;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily muting ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily muted on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}h`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            user.send(embed).then(() => {
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                member.addRole(muted);
                msg.channel.send(`:ok_hand: muted ${user.tag} for ${num} hour(s) (\`${reason}\`)`);  
            });            
        } else if (args[1].endsWith('d')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 86400;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily muting ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily muted on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}d`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            user.send(embed).then(() => {
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                member.addRole(muted);
                msg.channel.send(`:ok_hand: muted ${user.tag} for ${num} day(s) (\`${reason}\`)`);  
            });                        
        } else if (args[1].endsWith('w')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 604800;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily muting ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily muted on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}w`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            user.send(embed).then(() => {
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                member.addRole(muted);
                msg.channel.send(`:ok_hand: muted ${user.tag} for ${num} week(s) (\`${reason}\`)`);  
            });      
        } else if (args[1].endsWith('mo')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 2.628e+6;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily muting ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily muted on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}mo`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            user.send(embed).then(() => {
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                member.addRole(muted);
                msg.channel.send(`:ok_hand: muted ${user.tag} for ${num} months(s) (\`${reason}\`)`);  
            });                        
        } else if (args[1].endsWith('y')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 3.154e+7;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily muting ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily muted on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}y`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            user.send(embed).then(() => {
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                member.addRole(muted);
                msg.channel.send(`:ok_hand: muted ${user.tag} for ${num} year(s) (\`${reason}\`)`);  
            });                        
        } else return msg.channel.send(':x: Invalid length');
    },
    meta: {
        aliases: ['tempmute'],
        description: 'Temporarily mute a user for a specified reason',
        permlvl: 1,
        usage: ''        
    }
}