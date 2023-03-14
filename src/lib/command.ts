import {
	type Message,
	type CommandInteraction,
	type ChatInputCommandInteraction,
	type UserContextMenuCommandInteraction,
	type MessageContextMenuCommandInteraction,
	type ApplicationCommandType,
	type PermissionResolvable,
	type ApplicationCommandData,
	type ApplicationCommandOptionData,
	REST,
	Routes,
} from 'discord.js';
import { readdirSync } from 'fs';
import type { Bot } from './client';

export interface Command {
	name: string;
	description?: string;
	aliases?: string[];
	type?:
		| ApplicationCommandType.ChatInput
		| ApplicationCommandType.Message
		| ApplicationCommandType.User;
	clientPermissions?: PermissionResolvable;
	userPermissions?: PermissionResolvable;
	category?: string;
	cooldown?: number | 1000;
	nsfw?: boolean | false;
	options?: ApplicationCommandOptionData[];

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

export async function registerCommands(client: Bot) {
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

export async function registerApplicationCommands(client: Bot) {
	client.console.debug('Initializing Application Command Registry...');
	const commands: ApplicationCommandData[] = [];
	const dirs = readdirSync('dist/commands');
	for (const dir of dirs) {
		const files = readdirSync(`dist/commands/${dir}`).filter((x) =>
			x.endsWith('.js')
		);
		for (const file of files) {
			const { default: command } = await import(
				`../commands/${dir}/${file}`
			);
			if (
				!command ||
				!command.name ||
				!command.chatInputRun ||
				!command.contextMenuRun
			)
				continue;
			client.console.debug(
				`Registering Application Command "${command.name}" of type "${command.type}"`
			);
			commands.push(build(command));
		}
	}

	const rest = new REST({ version: '10' }).setToken(
		process.env.DISCORD_TOKEN!
	);
	try {
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID!),
			{
				body: commands,
			}
		);
		client.console.debug(
			`Application Command Registry finished with ${
				(data as any).length
			} commands registered`
		);
	} catch (error) {
		client.console.error(error);
	}
}

function build(data: Command): ApplicationCommandData {
	return {
		name: data.name,
		description: data.description ?? 'a random command',
		type: data.type,
		defaultMemberPermissions: data.userPermissions ?? [],
		options: data.options ?? [],
	};
}
