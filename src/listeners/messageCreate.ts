import type { Message, TextChannel } from 'discord.js';
import { owners } from '../config';
import { doClientPermissionCheck, doPermissionCheck } from '../lib/utils';

export default async function run(msg: Message) {
	if (msg.author.bot || msg.author.system) return;
	if (msg.content.startsWith(msg.client.prefix)) {
		const args = msg.content.slice(msg.client.prefix.length).split(/ +/g);
		const c = args.shift();

		if (!c) return;

		const command =
			msg.client.commands.get(c) ||
			msg.client.commands.find((x) => x.aliases && x.aliases.includes(c));
		if (!command) return;
		if (!command.messageRun) return;
		try {
			if (command.ownerOnly && !owners.includes(msg.author.id)) {
				msg.reply({
					content: 'This command can only be used by the owners',
				});
				return;
			}
			if (
				command.clientPermissions &&
				!doClientPermissionCheck(
					msg.channel as TextChannel,
					msg.guild?.members.me!,
					command.clientPermissions
				)
			) {
				msg.reply({
					content: `I'm missing the ${command.userPermissions} permission`,
				});
				return;
			}
			if (
				command.userPermissions &&
				!doPermissionCheck(
					msg.channel as TextChannel,
					msg.member!,
					command.userPermissions
				)
			) {
				msg.reply({
					content: `Missing ${command.userPermissions} Permission`,
				});
				return;
			}
			await command.messageRun(msg, args);
		} catch (error) {
			msg.reply('An error occurred');
			msg.client.console.error(error);
		}
	}
}
