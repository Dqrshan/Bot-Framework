import type { Message } from 'discord.js';
import { doPermissionCheck } from '../lib/utils';

export default async function run(msg: Message) {
	if (msg.author.bot || msg.author.system) return;
	if (!msg.content.startsWith(msg.client.prefix)) return;

	const args = msg.content.slice(msg.client.prefix.length).split(/ +/g);
	const c = args.shift();

	if (!c) return;

	const command =
		msg.client.commands.get(c) ||
		msg.client.commands.find((x) => x.aliases && x.aliases.includes(c));
	if (!command) return;
	if (!command.messageRun) return;
	try {
		const bool = await doPermissionCheck(command, msg);
		if (!bool) return;
		await command.messageRun(msg, args);
	} catch (error) {
		msg.reply('An error occurred');
		msg.client.console.error(error);
	}
}
