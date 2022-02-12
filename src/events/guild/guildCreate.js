const Event = require("../../structures/Event");

module.exports = class guildCreate extends Event {
	constructor(client) {
		super(client, {
			name: "guildCreate",
			once: false,
		});
	}

	async exec(guild) {
		this.client.logger.log(`Joined ${guild.name} | ${guild.id}`, {
			tag: "guildCreate",
		});
	}
};
