import { config } from 'dotenv';
import { Bot, loadListeners } from './lib';

config();

const client = new Bot();
client.init();

(async () => await loadListeners(client))();
