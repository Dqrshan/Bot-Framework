import consola from 'consola';
// import type { Collection } from '@discordjs/collection';
// import type { Command } from './lib/command';
// import { Listener } from './lib/listener';

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
        }
    }
}

declare module '@discordjs/core' {
    interface Client {
        console: typeof consola;
        // commands: Collection<string, Command>;
        // events: Collection<string, Listener>;
    }
}
