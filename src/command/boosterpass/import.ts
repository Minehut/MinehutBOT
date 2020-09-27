import { MinehutCommand } from "../../structure/command/minehutCommand";
import { PermissionLevel } from "../../util/permission/permissionLevel";
import { Message } from "discord.js";
import * as XLSX from "xlsx";
import { BoosterPass, BoosterPassModel } from "../../model/boosterPass";
import fetch from "node-fetch";

interface BoosterPassDocument {
    'Nitro Booster': string;
    'Booster ID': string;
    'Booster #1': string;
    'Booster #1 ID': string;
    'Booster #2': string;
    'Booster #2 ID': string;
}

export default class BoosterPassImport extends MinehutCommand {
    constructor() {
        super('boosterpass-import', {
            permissionLevel: PermissionLevel.SeniorModerator,
            category: 'boosterpass',
            channel: 'guild',
            description: {
                content: 'Import a spreadsheet of boosterpasses',
                usage: '',
                examples: [
                    'boosterpass import'
                ]
            }
        });
    }

    async exec(msg: Message) {
        if (msg.attachments.size != 1)
            return msg.channel.send(`${process.env.EMOJI_CROSS} You must attach one file.`);
        
        const attachment = msg.attachments.first()!;

        if (!attachment.name?.endsWith('.xlsx'))
            return msg.channel.send(`${process.env.EMOJI_CROSS} You must attach a XLSX file.`);

        const res = await fetch(attachment.url);
        const buffer = await res.buffer();

        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetNameList = workbook.SheetNames;
        const sheetToJson: BoosterPassDocument[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

        sheetToJson.forEach(async v => {
            const granterId = v["Booster ID"];
            const granterTag = v["Nitro Booster"];

            if (granterId && granterTag) {
                if (v["Booster #1"]) {
                    const grantedId = v["Booster #1 ID"];
                    const grantedTag = v["Booster #1"]
                    if (grantedId && grantedTag) {
                        const boosterPass = {
                            granterId,
                            granterTag,
                            grantedId,
                            grantedTag,
                            guild: msg.guild!.id
                        } as BoosterPass;
                        BoosterPassModel.create(boosterPass);    
                    }
                }
            
                if (v["Booster #2"]) {
                    const grantedId = v["Booster #2 ID"];
                    const grantedTag = v["Booster #2"]
                    if (grantedId && grantedTag) {
                        const boosterPass = {
                            granterId,
                            granterTag,
                            grantedId,
                            grantedTag,
                            guild: msg.guild!.id
                        } as BoosterPass;
                        BoosterPassModel.create(boosterPass);    
                    }
                }            
            }
        });

        return msg.channel.send(`${process.env.EMOJI_CHECK} Successfully imported booster passes!`);
    }
}