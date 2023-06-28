import { Client, GatewayDispatchEvents, MappedEvents } from '@discordjs/core';
import { readdirSync } from 'fs';
import { events } from '../index';

export interface Listener {
    name: string;
    event: keyof MappedEvents;
    once?: boolean | false;
    run: (...args: any[]) => Promise<unknown>;
}

export const loadEvents = async (client: Client) => {
    client.console.info('Loading events..');
    const files = readdirSync('dist/listeners').filter((x) =>
        x.endsWith('.js')
    );
    for (const file of files) {
        // @ts-ignore
        const { default: event } = (await import(
            `../listeners/${file}`
        )) as Listener;
        if (!event.run) continue;
        if (event.event === GatewayDispatchEvents.Ready)
            client.once(event.event, event.run.bind(null, client));
        else if (event.once) client.once(event.event, event.run);
        else client.on(event.event, event.run);
        events.set(event.name, event);
    }
    client.console.success(`Listening to ${events.size} events`);
};
