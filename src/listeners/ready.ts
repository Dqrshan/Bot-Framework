import { GatewayDispatchEvents } from '@discordjs/core';
import { Listener } from '../lib/listener';

const event: Listener = {
    name: 'ready',
    event: GatewayDispatchEvents.Ready,
    once: true,
    run: async (client) => {
        client.console.success('Ready!');
    }
};

export default event;
