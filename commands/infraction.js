const Table = require('cli-table2');
const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send('Invalid args! Usage: `!inf <search/info/duration> <snowflake/id> <time(if duration)>`');
        if (args[0] == 'search') {
            let user;
            if (msg.mentions.users.size > 0) {
                user = msg.mentions.users.first();
            } else user = await client.fetchUser(args[1]);
            const data = await client.db.table('userData').get(args[1]).run();
            if (!user && !data) return msg.channel.send(':x: Invalid user!');
            function getID(user, data) {
                let id;
                if (user && !data) {
                    id = user.id;
                } else id = data.id;
                return id;
            }
            const punishments = await client.db.table('punishments').filter({ punished: { id: getID(user, data) } }).orderBy(client.db.desc('date')).limit(10).run();
            if (punishments.length == 0) return msg.channel.send(':x: User has no punishments');
            const inftable = new Table({
                head: [ 'ID', 'User', 'Moderator', 'Created', 'Type', 'Active', 'Reason' ],
                chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                , 'right': '' , 'right-mid': '' , 'middle': ' ' },
           });
           function rewriteCreated(date) {
                let newDate;
                newDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
                return newDate;
           }
           punishments.forEach(inf => {
               inftable.push([ inf.id, inf.punished.name, inf.moderator.name, rewriteCreated(inf.date), inf.type, inf.active, inf.reason ]);
           });
           msg.channel.send(`\`\`\`${inftable.toString()}\`\`\``);      
        } else if (args[0] == 'info') {
            if (!args[1]) return msg.channel.send(':x: You must supply an ID.');
            const id = parseInt(args[1], 10);
            if (id == NaN) return msg.channel.send(':x: ID is not a number.');
            const punishment = await client.db.table('punishments').get(id).run();
            if (!punishment) return msg.channel.send(':x: Invalid ID');
            const embed = new Discord.RichEmbed()
            .addField('ID', id)
            .addField('Punished', punishment.punished.name)
            .addField('Moderator', punishment.moderator.name)
            .addField('Type', punishment.type)
            .addField('Created', punishment.date.toString())
            .addField('Active', punishment.active)
            .addField('Reason', getReason(punishment))
            .setThumbnail(punishment.punished.avatarURL)
            .setColor(getColor(punishment));
            msg.channel.send(embed);
            function getReason(punishment) {
                let reason;
                if (punishment.reason == null) {
                    reason = 'None'
                } else reason = punishment.reason;
                return reason;
            }
            function getColor(punishment) {
                let color;
                if (punishment.active == true) {
                    color = '#FF0000'
                } else if (punishment.active == false) {
                    color = '#32CD32'
                }
                return color;
            }
        } else if (args[0] == 'duration') {
            if (!args[1]) return msg.channel.send(':x: You must supply an ID.');
            const id = parseInt(args[1], 10);
            if (id == NaN) return msg.channel.send(':x: ID must be a number.');
            const punishment = await client.db.table('punishments').get(id).run();
            if (!punishment) return msg.channel.send(':x: Invalid ID');
            if (punishment.active == false) return msg.channel.send(':x: Punishment has already expired.');
            if (args[2].endsWith('s')) {
                const num = parseInt(args[2], 10);
                if (args[2].length == 1) return msg.channel.send(':x: Invalid length');
                const date = new Date();
                const expDate = date.setSeconds(num);
                client.db.table('punishments').get(id).update({ dateExpired: expDate }).run();
                msg.channel.send(`:ok_hand: updated duration of inf ${id}`);
            } else if (args[2].endsWith('m')) {
                const num = parseInt(args[2], 10);
                if (args[2].length == 1) return msg.channel.send(':x: Invalid length');
                const date = new Date();
                const seconds = num * 60;
                const expDate = date.setSeconds(seconds);
                client.db.table('punishments').get(id).update({ dateExpired: expDate }).run();
                msg.channel.send(`:ok_hand: updated duration of inf ${id}`);                
            } else if (args[2].endsWith('h')) {
                const num = parseInt(args[2], 10);
                if (args[2].length == 1) return msg.channel.send(':x: Invalid length');
                const date = new Date();
                const seconds = num * 3600;
                const expDate = date.setSeconds(seconds);
                client.db.table('punishments').get(id).update({ dateExpired: expDate }).run();
                msg.channel.send(`:ok_hand: updated duration of inf ${id}`);                
            } else if (args[2].endsWith('d')) {
                const num = parseInt(args[2], 10);
                if (args[2].length == 1) return msg.channel.send(':x: Invalid length');
                const date = new Date();
                const seconds = num * 86400;
                const expDate = date.setSeconds(seconds);
                client.db.table('punishments').get(id).update({ dateExpired: expDate }).run();
                msg.channel.send(`:ok_hand: updated duration of inf ${id}`);
            } else if (args[2].endsWith('w')) {
                const num = parseInt(args[2], 10);
                if (args[2].length == 1) return msg.channel.send(':x: Invalid length');
                const date = new Date();
                const seconds = num * 31557600;
                const expDate = date.setSeconds(seconds);
                client.db.table('punishments').get(id).update({ dateExpired: expDate }).run();
                msg.channel.send(`:ok_hand: updated duration of inf ${id}`);
            } else if (args[2].endsWith('mo')) {
                const num = parseInt(args[2], 10);
                if (args[2].length == 1) return msg.channel.send(':x: Invalid length');
                const date = new Date();
                const seconds = num * 2592000;
                const expDate = date.setSeconds(seconds);
                client.db.table('punishments').get(id).update({ dateExpired: expDate }).run();
                msg.channel.send(`:ok_hand: updated duration of inf ${id}`);
            } else if (args[2].endsWith('y')) {
                const num = parseInt(args[2], 10);
                if (args[2].length == 1) return msg.channel.send(':x: Invalid length');
                const date = new Date();
                const seconds = num * 31104000;
                const expDate = date.setSeconds(seconds);
                client.db.table('punishments').get(id).update({ dateExpired: expDate }).run();
                msg.channel.send(`:ok_hand: updated duration of inf ${id}`);
            } else return msg.channel.send(':x: Invalid length');
        }
    },
    meta: {
        aliases: ['infraction', 'inf'],
        description: 'Do things with infractions',
        permlvl: 2,
        usage: ''     
    }
}