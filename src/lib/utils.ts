import type { CommandInteraction, GuildMember, Message } from 'discord.js';
import type { Command } from './command';

export async function doPermissionCheck(
	command: Command,
	ctx: Message | CommandInteraction
): Promise<boolean> {
	if (!command.userPermissions || !command.clientPermissions) return true;

	if ((ctx.member as GuildMember).permissions.has(command.userPermissions)) {
		if (ctx.guild?.members.me?.permissions.has(command.clientPermissions))
			return true;
		else return false;
	}

	return false;
}
