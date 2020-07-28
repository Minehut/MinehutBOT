import { ClientEvents } from 'discord.js';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../model/case';
import { GuildMember } from 'discord.js';
import { Message } from 'discord.js';
import { CensorCheckResponse } from '../util/functions';

export default interface MinehutClientEvents extends ClientEvents {
	caseUpdate: [DocumentType<Case>, DocumentType<Case>, GuildMember];
	caseDelete: [DocumentType<Case>, GuildMember];
	caseCreate: [DocumentType<Case>];
	messageCensor: [Message, CensorCheckResponse];
}

export type MinehutClientEvent = keyof MinehutClientEvents;
