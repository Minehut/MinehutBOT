import { randomAlphanumericString } from '../../util/functions';
import { Guild } from 'discord.js';
import { MinehutClient } from '../../client/minehutClient';
import { truncate } from 'lodash';
import { GuildMember } from 'discord.js';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';

export interface ActionData {
	guild: Guild;
	reason?: string;

	moderator: GuildMember;
	client: MinehutClient;
}

export class Action {
	id: string;
	guild: Guild;
	reason: string;
	moderator: GuildMember;

	document?: DocumentType<Case>;

	client: MinehutClient;
	constructor(data: ActionData) {
		this.client = data.client;

		this.id = randomAlphanumericString(4);

		this.guild = data.guild;
		this.moderator = data.moderator;

		this.reason = truncate(data.reason || 'No reason provided', {
			length: 2000,
		});
	}

	async after() {
		if (!this.document) return;
		this.client.emit('caseCreate', this.document);
	}
}
