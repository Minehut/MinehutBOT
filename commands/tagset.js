const fs = require('fs');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must include a tag name!');
        fs.readdir('commands', async (err, files) => {
            if (err) console.error(err);
            const array = [];
            for (var i = 0; i < files.length; ++i) {
                const file = files[i];
                const meta = require('../commands/' + file).meta;
                if (meta.aliases.includes(args[0])) {
                    array.push(meta);     
                }
            }
            if (array.length > 0) return msg.channel.send(':x: Tag is a command!');
            const content = args.slice(1).join(' ');
            if (!content) return msg.channel.send(':x: The tag must include content!');
            const tag = await client.db.table('tags').get(args[0]).run();
            if (!tag) {
                client.db.table('tags').insert({ id: args[0], content: content }).run();
                msg.channel.send(`:ok_hand: created a tag (\`${args[0]}\`)`);
            } else {
                if (content == tag.content) return msg.channel.send(':x: Tag content is already equal to message content!');
                client.db.table('tags').get(args[0]).update({ content: content }).run();
                msg.channel.send(`:ok_hand: updated a tag (\`${args[0]}\`)`);
            }
        });
    },
    meta: {
        aliases: ['tagset'],
        description: '',
        permlvl: 4,
        usage: ''          
    }
}