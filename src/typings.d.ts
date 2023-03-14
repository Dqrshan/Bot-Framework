import consola from 'consola';
import type { Collection } from 'discord.js';
import type { Command } from './lib';

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_TOKEN: string;
			CLIENT_ID: string;
		}
	}
}

declare module 'discord.js' {
	interface Client {
		console: typeof consola;
		commands: Collection<string, Command>;
		prefix: string;
	}
}
