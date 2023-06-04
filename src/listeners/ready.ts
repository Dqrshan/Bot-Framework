import { ActivityType, Client } from 'discord.js';

export default async function run(client: Client) {
    client.user?.setPresence({
        activities: [
            {
                name: 'You',
                type: ActivityType.Watching
            }
        ],
        status: 'online'
    });

    const { tag, id } = client.user!;
    client.console.info('Ready!');
    client.console.info(`Logged in as ${tag} [${id}]`);
    return;
}
