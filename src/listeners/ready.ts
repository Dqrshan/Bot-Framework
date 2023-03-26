import { ActivityType, Client } from 'discord.js';

export default async function run(client: Client) {
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
	return;
}
