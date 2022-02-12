const Interaction = require("../../structures/Interaction");

module.exports = class SlashPing extends Interaction {
	constructor(client) {
		super(client, {
			name: "ping",
			description: "Ping command",
		});
	}
	async exec(interaction) {
		interaction.reply({
			ephemeral: true,
			content: [
				`:heart: My latency - **${Math.round(
					interaction.createdTimestamp - Date.now()
				)}**ms`,
				`:computer: Discord latency - **${Math.round(this.client.ws.ping)}**ms`,
			].join("\n"),
		});
	}
};
