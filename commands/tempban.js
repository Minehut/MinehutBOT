const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must mention who you want to tempmute.');
        let user;
        if (msg.mentions.users.size > 0) {
            user = msg.mentions.users.first();
        } else user = client.users.get(args[0]);
        if (!user) return msg.channel.send(':x: Invalid user');
        const member = (await msg.guild.fetchMembers()).members.get(user.id);
        if (!member) return msg.channel.send(':x: Guild member not found! Could they have left the guild?');
        if (!args[1]) return msg.channel.send(`:x: Invalid length`);
        if (args[1].endsWith('s')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const expDate = date.setSeconds(num);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily banning ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'BAN', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily banned on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}s`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            try {
                user.send(embed);
            } catch (e) {
                msg.channel.send('couldn\'t dm user');
            }
            msg.guild.ban(user.id, { reason: reason });
            msg.channel.send(`:ok_hand: banned ${user.tag} for ${num} second(s) (\`${reason}\`)`);                   
        } else if (args[1].endsWith('m')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 60;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily banning ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'BAN', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily banned on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}m`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            try {
                user.send(embed);
            } catch (e) {
                msg.channel.send('couldn\'t dm user');
            }
            msg.guild.ban(user.id, { reason: reason });
            msg.channel.send(`:ok_hand: banned ${user.tag} for ${num} minute(s) (\`${reason}\`)`);                   
        } else if (args[1].endsWith('h')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 3600;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily banning ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'BAN', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily banned on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}h`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            try {
                user.send(embed);
            } catch (e) {
                msg.channel.send('couldn\'t dm user');
            }
            msg.guild.ban(user.id, { reason: reason });
            msg.channel.send(`:ok_hand: banned ${user.tag} for ${num} hour(s) (\`${reason}\`)`);                   
        } else if (args[1].endsWith('d')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 86400;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily banning ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'BAN', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily banned on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}d`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            try {
                user.send(embed);
            } catch (e) {
                msg.channel.send('couldn\'t dm user');
            }
            msg.guild.ban(user.id, { reason: reason });
            msg.channel.send(`:ok_hand: banned ${user.tag} for ${num} day(s) (\`${reason}\`)`);                   
        } else if (args[1].endsWith('mo')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 2628000;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily banning ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'BAN', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily banned on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}mo`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            try {
                user.send(embed);
            } catch (e) {
                msg.channel.send('couldn\'t dm user');
            }
            msg.guild.ban(user.id, { reason: reason });
            msg.channel.send(`:ok_hand: banned ${user.tag} for ${num} month(s) (\`${reason}\`)`);                   
        } else if (args[1].endsWith('y')) {
            if (args[1].length == 1) return msg.channel.send(':x: Invalid length');
            const date = new Date();
            const num = parseInt(args[1], 10);
            const seconds = num * 31557600;
            const expDate = date.setSeconds(seconds);
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(`:x: You must include a reason for temporarily banning ${user.tag}.`);
            const numData = await client.db.table('numData').get('punishments').run();
            const id = numData.number;
            const datepunished = new Date();
            const num2insert = numData.number+1;
            client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'BAN', date: datepunished, dateExpired: expDate, active: true }).run();
            client.db.table('userData').get(user.id).update({ muted: true }).run();
            client.db.table('numData').get('punishments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setDescription('You have been temporarily banned on Minehut!')
            .addField('ID', id, true)
            .addField('Moderator', msg.author.tag, true)
            .addField('Reason', reason, true)
            .addField('Duration', `${num}y`, true)
            .setColor('#FF0000')
            .setFooter(`Punished: ${datepunished}`);
            try {
                user.send(embed);
            } catch (e) {
                msg.channel.send('couldn\'t dm user');
            }
            msg.guild.ban(user.id, { reason: reason });
            msg.channel.send(`:ok_hand: banned ${user.tag} for ${num} year(s) (\`${reason}\`)`);                   
        } else return msg.channel.send(':x: Invalid length');
    },
    meta: {
        aliases: ['tempban'],
        description: 'Temporarily ban a user for a specified reason',
        permlvl: 1,
        modCmd: true,
        usage: ''        
    }
}