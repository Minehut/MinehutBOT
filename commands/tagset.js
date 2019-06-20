const fs = require('fs');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must include a tag name!');
        const command = args[0].toLowerCase();
        fs.readdir('commands', async (err, files) => {
            if (err) console.error(err);
            const array = [];
            for (var i = 0; i < files.length; ++i) {
                const file = files[i];
                const meta = require('../commands/' + file).meta;
                if (meta.aliases.includes(command)) {
                    array.push(meta);     
                }
            }
            if (array.length > 0) return msg.channel.send(':x: Tag is a command!');
            const content = args.slice(1).join(' ');
            if (!content) return msg.channel.send(':x: The tag must include content!');
            const tag = await client.db.table('tags').get(command).run();
            if (!tag) {
                client.db.table('tags').insert({ id: command, content: content }).run();
                msg.channel.send(`:ok_hand: created a tag (\`${command}\`)`);
            } else {
                if (content == tag.content) return msg.channel.send(':x: Tag content is already equal to message content!');
                client.db.table('tags').get(command).update({ content: content }).run();
                msg.channel.send(`:ok_hand: updated a tag (\`${command}\`)`);
            }
        });
    },
    meta: {
        aliases: ['tagset'],
        description: '',
        permlvl: 1,
        usage: ''          
    }
}