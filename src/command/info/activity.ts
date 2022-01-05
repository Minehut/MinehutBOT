import { Collection, Message, StageChannel, VoiceChannel } from "discord.js";
import { MinehutCommand } from "../../structure/command/minehutCommand";
import fetch from 'node-fetch';

export default class ActivityCommand extends MinehutCommand {
    constructor() {
        super('activity', {
			aliases: ['activity'],
			cooldown: 10000,
            ratelimit: 1,
			description: {
				content: 'To start an activity',
				usage: '<activity>',
				examples: ['youtube'],
			},
			category: 'info',
			args: [
				{
					id: 'activityname',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what type of activity would you like to start?\n\`youtube\`, \`fishington\`, \`chess\`, \`checkers\`, \`betrayal\`, \`doodlecrew\`, \`wordsnacks\`, \`lettertile\`, \`poker\`, \`spellcast\``,
						retry: (msg: Message) =>
							`${msg.author}, please provide an activity name.`,
					},
				}
			],
		});
	}

    async exec(msg: Message, { activityname }: { activityname: string}) {

        if(!msg.member?.voice.channel) {
            await msg.channel.send(`${msg.author}, please join a voice channel.`);
            return;
        }

        const vc: VoiceChannel | StageChannel = msg.member.voice.channel;

        if(!msg.member.permissions.has(1n << 39n)) { //START_EMBEDDED_ACTIVITIES
			await msg.channel.send(`${process.env.EMOJI_CROSS} You do not have permission to start activities in <#${vc.id}>.`);
            return;
        }

		const applications: Collection<string, string> = new Collection();
		applications.set("youtube", "880218394199220334");
		applications.set("fishington", "814288819477020702");
		applications.set("chess", "832012774040141894");
		applications.set("checkers", "832013003968348200");
		applications.set("betrayal", "773336526917861400");
		applications.set("doodlecrew", "878067389634314250");
		applications.set("wordsnacks", "879863976006127627");
		applications.set("lettertile", "879863686565621790");
		applications.set("poker", "755827207812677713");
		applications.set("spellcast", "852509694341283871");
		const app = applications.get(activityname.toLowerCase());

		if(!app) {
			await msg.channel.send(`${process.env.EMOJI_CROSS} That is not an activity option.`);
            return;
		}

		const inviteData = await fetch(`https://discord.com/api/v8/channels/${vc.id}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: app,
                target_type: 2,
                temporary: false
            }),
            headers: {
                "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json"
            }
        }).then(response => response.json());

		if(inviteData.code == null) {
			await msg.channel.send(`${msg.author}, there was an unknown error while generating the link, please try again.`);
        	return;
		}

        await msg.channel.send(`Enjoy the games! https://discord.gg/${inviteData.code} (Click the link, not the embed)`);

    }

}