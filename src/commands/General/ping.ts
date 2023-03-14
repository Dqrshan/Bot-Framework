import {
	ApplicationCommandType,
	CommandInteraction,
	Message,
} from 'discord.js';
import type { Command } from '../../lib';

const ping: Command = {
	name: 'ping',
	type: ApplicationCommandType.ChatInput,
	description: 'Latency of the bot',
	messageRun: async (msg: Message) => {
		return msg.reply(`Ping! ${msg.client.ws.ping} ms`);
	},

	chatInputRun: async (ctx: CommandInteraction) => {
		ctx.reply(`Ping! ${ctx.client.ws.ping} ms`);
		return;
	},
};

export default ping;
