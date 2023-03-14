// import type { Events } from 'discord.js';
import type { Bot } from './client';
import { readdirSync } from 'fs';

// export interface Listener {
// 	name: Events;
// 	once?: boolean | false;
// 	run: (args: any) => Promise<unknown>;
// }

export async function loadListeners(client: Bot) {
	let count = 0;
	const files = readdirSync('dist/listeners').filter((x) =>
		x.endsWith('.js')
	);
	for (const file of files) {
		count += 1;
		const { default: run } = await import(`../listeners/${file}`);
		const name = file.split('.')[0];

		client.on(name, run);
	}
	client.console.debug(`Listening to ${count} events..`);
}
