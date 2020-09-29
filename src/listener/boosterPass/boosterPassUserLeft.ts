import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { BoosterPassModel } from "../../model/boosterPass";

export default class BoosterPassUserLeftListener extends Listener {
    constructor() {
        super('boosterPassUserLeft', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    async exec(member: GuildMember) {
        const receivedBoosterPasses = await BoosterPassModel.getGrantedBoosterPasses(member);
        
        if (receivedBoosterPasses.length > 0)
            receivedBoosterPasses.forEach(bp => 
                bp.remove()    
            );
    }
}