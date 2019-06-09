const download = require('image-downloader');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: Invalid args! Usage: `!set <pfp/name>`');
        if (args[0] == 'name') {
            const name = args.slice(1).join(' ');
            if (!name) return msg.channel.send(':x: You must include a name!');
            client.user.setUsername(name);
            msg.channel.send(`:ok_hand: set the username of the bot (\`${name}\`)`);
        } else if (args[0] == 'pfp') {
            if (!args[1] && msg.attachments.size <= 0) return msg.channel.send(':x: You must either provide a direct link to the avatar image or attach a picture.');
            if (args[1] && msg.attachments.size <= 0) {
                client.user.setAvatar(args[1]);
                msg.channel.send(`:ok_hand: set the avatar of the bot to direct link`);
            } else if (msg.attachments.size > 0) {
                if (msg.attachments.size > 1) return msg.channel.send(':x: You can only set one avatar for the bot.');
                const attachment = msg.attachments.first();
                client.user.setAvatar(attachment.url);
                msg.channel.send(':ok_hand: set the avatar of the bot to attachment');
            }
        } else return msg.channel.send(':x: Invalid args! Usage: `!set <pfp/name>`');
    },
    meta: {
        aliases: ['set'],
        description: 'Set bot avatar and pfp',
        permlvl: 5,
        usage: ''         
    }
}