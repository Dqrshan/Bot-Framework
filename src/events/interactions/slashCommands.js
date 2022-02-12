const Event = require("../../structures/Event");

module.exports = class SlashCommands extends Event {
	constructor(client) {
		super(client, {
			name: "slashCommands",
			once: false,
		});
	}
	async exec(interaction) {
		const cmd = this.client.interactions.get(interaction.commandName);
		try {
			await cmd.exec(interaction);
		} catch (err) {
			interaction.reply({ ephemeral: true, content: "I got an error!" });
			return this.client.logger.error(`An error occured: ${err.message}`, {
				tag: "Interaction",
			});
		}
	}
};
