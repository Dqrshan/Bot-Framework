import { config } from 'dotenv';
import { loadCommands } from './lib/command.js';
import { readdirSync } from 'fs';
import {
	ApplicationCommandData,
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
	REST,
	Routes,
} from 'discord.js';
import consola from 'consola';
import { clientId, prefix } from './config.js';

config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.User,
		Partials.Message,
	],
});

client.console = consola;
client.commands = new Collection();
client.prefix = prefix;

const loadEvents = async (client: Client) => {
	client.console.log('Loading events..');
	let count = 0;
	const files = readdirSync('dist/listeners').filter((x) =>
		x.endsWith('.js')
	);
	for (const file of files) {
		count += 1;
		const { default: run } = await import(`./listeners/${file}`);
		if (!run) continue;
		const name = file.split('.')[0];
		if (name === 'ready') client.on(name, run.bind(null, client));
		else client.on(name, run);
	}
	client.console.info(`Listening to ${count} events`);
};

const registerApplicationCommands = async (client: Client) => {
	client.console.log('Initializing Application Command Registry..');

	const commands: ApplicationCommandData[] = [];
	const dirs = readdirSync('dist/commands');
	for (const dir of dirs) {
		const files = readdirSync(`dist/commands/${dir}`).filter((x) =>
			x.endsWith('.js')
		);
		for (const file of files) {
			const { default: command } = await import(
				`./commands/${dir}/${file}`
			);
			if (!command || !command.applicationCommand) continue;

			commands.push(command.applicationCommand.toJSON());
		}
	}

	const rest = new REST({ version: '10' }).setToken(
		process.env.DISCORD_TOKEN
	);
	try {
		const data = await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});
		client.console.info(
			`Application Command Registry finished with ${
				(data as any[]).length
			} commands registered.`
		);
	} catch (error) {
		client.console.error(error);
	}
};

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

Promise.all([
	loadEvents(client),
	registerApplicationCommands(client),
	loadCommands(client),
]).then(() => client.login(process.env.DISCORD_TOKEN));
