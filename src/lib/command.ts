import { SlashCommandBuilder } from '@discordjs/builders';
import {
    Permissions,
    APIChatInputApplicationCommandInteraction,
    // APIMessageApplicationCommandInteraction,
    // APIUserApplicationCommandInteraction,
    Client,
    APIApplicationCommandInteraction,
    API,
    Routes,
    RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { readdirSync } from 'fs';
import { clientId } from '../config';
import { commands } from '../index';

export interface Command {
    name: string;
    description?: string;
    clientPermissions?: Permissions[];
    userPermissions?: Permissions[];
    category?: string;
    cooldown?: number | 1000;
    applicationCommand?:
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    ownerOnly?: boolean | false;
    chatInputRun?: (
        ctx:
            | APIChatInputApplicationCommandInteraction
            | APIApplicationCommandInteraction,
        api: API
    ) => Promise<unknown>;
    // to-do
    /* contextMenuRun?: (
        ctx:
            | APIMessageApplicationCommandInteraction
            | APIUserApplicationCommandInteraction
            | APIApplicationCommandInteraction
    ) => Promise<unknown>; */
}

export const loadCommands = async (client: Client) => {
    client.console.info('Loading commands..');
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
            command.category = dir;
            commands.set(command.name, command);
        }
    }
    client.console.success(`Registered ${commands.size} command(s)`);
};

export const registerCommands = async (rest: REST) => {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const dirs = readdirSync('dist/commands');
    for (const dir of dirs) {
        const files = readdirSync(`dist/commands/${dir}`).filter((x) =>
            x.endsWith('.js')
        );
        for (const file of files) {
            // @ts-ignore
            const { default: command } = (await import(
                `../commands/${dir}/${file}`
            )) as Command;
            if (!command || !command.applicationCommand) continue;
            commands.push(command.applicationCommand.toJSON());
        }
    }
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        const data = (await rest.put(Routes.applicationCommands(clientId), {
            body: commands
        })) as any;

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
};
