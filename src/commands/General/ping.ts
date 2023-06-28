import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../../lib/command';

const ping: Command = {
    name: 'ping',
    description: 'Latency of the bot',
    applicationCommand: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Latency of the bot'),

    chatInputRun: async (ctx, api) => {
        await api.interactions.reply(ctx.id, ctx.token, {
            content: 'Pong!'
        });
    }
};

export default ping;
