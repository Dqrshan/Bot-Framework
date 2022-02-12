const {
	embed,
	removeDuplicates,
	formatPerms,
	formatArray,
} = require("../../utils/Utils");
const Command = require("../../structures/Command");

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			aliases: ["pong"],
			description: "Ping command",
			category: "Misc",
			ownerOnly: false,
			cooldown: 3000,
		});
	}
	async exec(message, args) {
		const emb = embed()
			.setColor("2f3136")
			.setDescription(
				`Pong! ${Math.round(message.createdTimestamp - Date.now())}ms`
			);
		return message.channel.send({ embeds: [emb] });
	}
};
