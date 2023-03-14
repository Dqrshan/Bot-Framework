import { ActivityType } from 'discord.js';
import {
	type Bot,
	registerApplicationCommands,
	registerCommands,
} from '../lib';

export default async function run(client: Bot) {
	client.user?.setPresence({
		activities: [
			{
				name: 'You',
				type: ActivityType.Watching,
			},
		],
		status: 'online',
	});

	client.console.info('Ready!');
	client.console.info(
		`Logged in as ${client.user?.tag} [${client.user?.id}]`
	);
	await registerCommands(client);
	await registerApplicationCommands(client);
	return;
}
