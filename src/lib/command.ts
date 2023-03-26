import type {
	Message,
	CommandInteraction,
	ChatInputCommandInteraction,
	UserContextMenuCommandInteraction,
	MessageContextMenuCommandInteraction,
	ApplicationCommandType,
	PermissionResolvable,
	ApplicationCommandOptionData,
	Client,
} from 'discord.js';
import { readdirSync } from 'fs';

export interface Command {
	name: string;
	description?: string;
	aliases?: string[];
	type?:
		| ApplicationCommandType.ChatInput
		| ApplicationCommandType.Message
		| ApplicationCommandType.User
		| undefined;
	clientPermissions?: PermissionResolvable;
	userPermissions?: PermissionResolvable;
	category?: string;
	cooldown?: number | 1000;
	nsfw?: boolean | false;
	options?: ApplicationCommandOptionData[];
	ownerOnly?: boolean | false;

	messageRun?: (msg: Message, args?: string[]) => Promise<unknown>;
	chatInputRun?: (
		ctx: ChatInputCommandInteraction | CommandInteraction
	) => Promise<unknown>;
	contextMenuRun?: (
		ctx:
			| UserContextMenuCommandInteraction
			| MessageContextMenuCommandInteraction
			| CommandInteraction
	) => Promise<unknown>;
}

export async function loadCommands(client: Client) {
	const dirs = readdirSync('dist/commands');
	for (const dir of dirs) {
		const files = readdirSync(`dist/commands/${dir}`).filter((x) =>
			x.endsWith('.js')
		);
		for (const file of files) {
			const { default: command } = await import(
				`../commands/${dir}/${file}`
			);
			if (!command || !command.name) continue;
			client.commands.set(command.name, command);
		}
	}
	client.console.debug(`Registered ${client.commands.size} command(s)`);
}
