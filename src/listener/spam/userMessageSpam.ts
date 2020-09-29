import { Listener } from "discord-akairo";
import { Message, TextChannel } from "discord.js";
import { MuteAction } from "../../structure/action/mute";
import { InfluxManager } from "../../structure/manager/influx/influxManager";
import { THREE_HOUR_MS } from "../../util/constants";
import { splitMessagesByChannels } from "../../util/functions";
import { getPermissionLevel } from "../../util/permission/getPermissionLevel";
import { PermissionLevel } from "../../util/permission/permissionLevel";

export default class UserMessageSpam extends Listener {
    constructor() {
        super('userMessageSpam', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(msg: Message) {
        if (
            !msg.member || 
            msg.author.bot ||
            getPermissionLevel(msg.member, this.client) > PermissionLevel.Robot
        ) return;
        let memberMessageInfluxManager: InfluxManager<Message> | undefined = 
            this.client.influxManagerStore
                .getInfluxManager(msg.author.id);
        if (!memberMessageInfluxManager) {
            memberMessageInfluxManager = new InfluxManager<Message>(
                [],
                {
                    clearInterval: 5000,
                    executingQuantity: 5,
                    executingListener: this,
                    executingFunction: async (msgs) => {
                        const msg = msgs[0];
                        const action = new MuteAction({
                            target: msg.member!,
                            moderator: await msg.guild!.members.fetch(this.client.user!),
                            guild: msg.guild!,
                            reason: 'Spam Detected',
                            duration: THREE_HOUR_MS,
                            client: this.client
                        });
                        await action.commit();
                    },
                    afterExecutionFunction: async (msgs) => {
                        const splitChannels = splitMessagesByChannels(msgs);
                        const keys = splitChannels.keys();
                        splitChannels.forEach(v => {
                            const channel: TextChannel = keys.next().value;
                            channel.bulkDelete(v);
                        });
                    }
                }
            )
            this.client.influxManagerStore
                .registerInfluxManager(msg.author.id, memberMessageInfluxManager);
        }
        memberMessageInfluxManager.addInflux(msg);
    }
}