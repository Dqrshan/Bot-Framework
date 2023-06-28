import {
    GatewayDispatchEvents,
    InteractionType,
    MessageFlags
} from '@discordjs/core';
import { Listener } from '../lib/listener';
import { commands } from '../index';

const event: Listener = {
    name: 'interactionCreate',
    event: GatewayDispatchEvents.InteractionCreate,
    once: false,
    run: async ({ data: interaction, api }) => {
        console.log(interaction);
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = commands.get(interaction.data.name);
            if (!command) {
                await api.interactions.reply(
                    interaction.id,
                    interaction.token,
                    {
                        content: 'Unknown command',
                        flags: MessageFlags.Ephemeral
                    }
                );
                return;
            }
            if (!command.chatInputRun) return;
            try {
                await command.chatInputRun(interaction, api);
            } catch (error) {
                console.error(error);
                await api.interactions.reply(
                    interaction.id,
                    interaction.token,
                    {
                        content: `There was an error while executing this command!\n\`\`\`ts\n${error}\`\`\``,
                        flags: MessageFlags.Ephemeral
                    }
                );
            }
        }
    }
};

export default event;
