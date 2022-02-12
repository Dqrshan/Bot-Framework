const Event = require("../../structures/Event");

module.exports = class interactionCreate extends Event {
	constructor() {
		super({
			name: "interactionCreate",
			once: false,
		});
	}
	async exec(interaction) {
		if (interaction.isCommand())
			return this.client.emit("slashCommands", interaction);

		if (interaction.isContextMenu())
			return this.client.emit("slashCommands", interaction);
	}
};
