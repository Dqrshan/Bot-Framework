const { Client, Collection, Intents } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");
const { resolve } = require("path");
const { sync } = require("glob");

require("./Interaction");
require("./Command");
require("./Event");

class Bot extends Client {
	constructor() {
		super({
			intents: Object.values(Intents.FLAGS),
			allowedMentions: {
				parse: ["roles", "users"],
				repliedUser: false,
			},
		});
		this.prefix = "!";
		this.cooldowns = new Collection();
		this.commands = new Collection();
		this.events = new Collection();
		this.aliases = new Collection();
		this.owners = ["838620835282812969"];
		this.logger = require("../utils/Logger");
		this.interactions = new Collection();

		this.database = {};
	}

	/* Load slash commands for each guilds */
	async loadInteractions(guildId) {
		const intFile = await sync(resolve("./src/interactions/**/*.js"));
		intFile.forEach((filepath) => {
			const File = require(filepath);
			if (!(File.prototype instanceof Interaction)) return;
			const interaction = new File();
			interaction.client = this;
			this.interactions.set(interaction.name, interaction);
			const res = new REST({ version: "9" }).setToken(process.env.TOKEN);
			res.post(Routes.applicationCommands(process.env.CLIENT_ID), {
				body: interaction,
			});
		});
	}

	/* Load basic commands */
	async loadCommands() {
		const cmdFile = await sync(resolve("./src/commands/**/*.js"));
		cmdFile.forEach((filepath) => {
			const File = require(filepath);
			if (!(File.prototype instanceof Command)) return;
			const command = new File();
			command.client = this;
			this.commands.set(command.name, command);
			command.aliases.forEach((alias) => {
				this.aliases.set(alias, command.name);
			});
		});
	}

	/* Load events */
	async loadEvents() {
		const evtFile = await sync(resolve("./src/events/**/*.js"));
		evtFile.forEach((filepath) => {
			const File = require(filepath);
			if (!(File.prototype instanceof Event)) return;
			const event = new File();
			event.client = this;
			this.events.set(event.name, event);
			const emitter = event.emitter
				? typeof event.emitter === "string"
					? this[event.emitter]
					: emitter
				: this;
			emitter[event.type ? "once" : "on"](event.name, (...args) =>
				event.exec(...args)
			);
		});
	}

	/* Start the bot */
	async start(token) {
		await this.loadEvents();
		await this.loadCommands();
		await this.loadDatabase();
		await this.loadInteractions();
		return super.login(token);
	}
}

module.exports = { Bot };
