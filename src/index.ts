import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { GatewayIntentBits, Client } from '@discordjs/core';
import { Collection } from '@discordjs/collection';
import { config } from 'dotenv';
import { Command, loadCommands, registerCommands } from './lib/command';
import { Listener, loadEvents } from './lib/listener';
import consola from 'consola';

config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const gateway = new WebSocketManager({
    token: process.env.DISCORD_TOKEN,
    intents:
        GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.MessageContent,
    rest
});

const client = new Client({ rest, gateway });

client.console = consola;
const commands = new Collection<string, Command>();
const events = new Collection<string, Listener>();

Promise.all([
    loadCommands(client),
    registerCommands(rest),
    loadEvents(client)
]).then(() => gateway.connect());

export { commands, events };
