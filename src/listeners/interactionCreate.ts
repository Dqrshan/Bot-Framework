import type { CommandInteraction } from 'discord.js';
import { doPermissionCheck } from '../lib/utils';

export default async function run(ctx: CommandInteraction) {
	const command = ctx.client.commands.get(ctx.commandName);
	if (!command) return;

	try {
		if (command.ownerOnly && ctx.user.id !== process.env.OWNER) {
			ctx.reply({
				content: 'This command can only be used by the owners',
			});
			return;
		}
		const bool = await doPermissionCheck(command, ctx);
		if (!bool) return;
		if (ctx.isChatInputCommand()) {
			if (!command.chatInputRun) return;
			await command.chatInputRun(ctx);
		} else if (ctx.isContextMenuCommand()) {
			if (!command.contextMenuRun) return;
			await command.contextMenuRun(ctx);
		} else return;
	} catch (error) {
		ctx.client.console.error(error);
	}
}
