module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: Invalid args! Usage: `!tagaliases <add/remove> <tag> <alias>`');
        if (args[0] == 'add') {
            if (!args[1]) return msg.channel.send(':x: You must supply a tag!');
            const command = args[1].toLowerCase();
            const tag = await client.db.table('tags').get(command).run();
            if (!tag) return msg.channel.send(':x: Tag doesn\'t exist!');
            const tags = tag.aliases;
            if (!args[2]) return msg.channel.send(':x: You must include an alias to add!');
            const alias = args[2].toLowerCase();
            if (!tags) {
                const newtags = [];
                newtags.push(alias);
                client.db.table('tags').get(command).update({ aliases: newtags }).run();
                msg.channel.send(`:ok_hand: added alias \`${alias}\` to a tag (\`${command}\`)`);
            } else {
                if (tags.includes(alias)) return msg.channel.send(':x: There\'s already an alias by that name!');
                tags.push(alias);
                client.db.table('tags').get(command).update({ aliases: tags }).run();
                msg.channel.send(`:ok_hand: added alias \`${alias}\` to a tag (\`${command}\`)`);
            }
        } else if (args[0] == 'remove') {
            if (!args[1]) return msg.channel.send(':x: You must supply a tag!');
            const command = args[1].toLowerCase();
            const tag = await client.db.table('tags').get(command).run();
            if (!tag) return msg.channel.send(':x: Tag doesn\'t exist!');
            const tags = tag.aliases;
            if (!args[2]) return msg.channel.send(':x: You must include an alias to add!');
            const alias = args[2].toLowerCase();
            if (!tags) return msg.channel.send(':x: There are no aliases, so you can\'t remove any aliases!');
            if (!tags.includes(alias)) msg.channel.send(':x: Invalid alias!');
            const tags2insert = tags.filter(a => a !== alias);
            client.db.table('tags').get(command).update({ aliases: tags2insert }).run();
            msg.channel.send(`:ok_hand: removed alias \`${alias}\` from a tag (\`${command}\`)`);
        } else return msg.channel.send(':x: Invalid args! Usage: `!tagaliases <add/remove> <tag> <alias>`');
    },
    meta: {
        aliases: ['tagaliases'],
        description: '',
        permlvl: 1,
        modCmd: false,
        usage: '' 
    }
}