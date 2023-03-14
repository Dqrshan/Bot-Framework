import {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
	Options,
} from 'discord.js';
import consola from 'consola';
import type { Command } from './command';

export class Bot extends Client {
	console: typeof consola;
	commands: Collection<string, Command>;
	prefix: string;
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.MessageContent,
			],
			makeCache: Options.cacheWithLimits({
				ApplicationCommandManager: 0,
				GuildMemberManager: undefined,
				UserManager: undefined,
				MessageManager: 100,
			}),
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.User,
				Partials.Message,
			],
			failIfNotExists: false,
			shards: 'auto',
		});

		this.console = consola;
		this.commands = new Collection();
		this.prefix = '!';
	}

	public init() {
		return this.login(); // Defaults to "process.env.DISCORD_TOKEN"
	}
}
