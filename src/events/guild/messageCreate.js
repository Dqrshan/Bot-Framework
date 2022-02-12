const { formatArray, formatPerms } = require("../../utils/Utils");
const { Collection } = require("discord.js");
const Event = require("../../structures/Event");

module.exports = class messageCreate extends Event {
	constructor(client) {
		super(client, {
			name: "messageCreate",
			once: false,
		});
	}
	async exec(message) {
		const mentionRegPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot || !message.guild) return;
		const prefix = message.content.match(mentionRegPrefix)
			? message.content.match(mentionRegPrefix)[0]
			: this.client.prefix;
		/* If the message does not start with one of our prefix we return nothing */
		if (!message.content.startsWith(prefix)) return;
		const [cmd, ...args] = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		const command =
			this.client.commands.get(cmd.toLowerCase()) ||
			this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (message.guild) {
				const memberCheck = command.permissions;
				if (memberCheck) {
					const missing = message.channel
						.permissionsFor(message.member)
						.missing(memberCheck);
					if (missing.length) {
						await message.channel.sendTyping();
						return message.reply(
							`Missing \`${formatArray(missing.map(formatPerms))}\` Permission`
						);
					}
				}
				/* Client permissions */
				// const clientCheck = command.clientPerms;
				// if (clientCheck) {
				// 	const missing = message.channel
				// 		.permissionsFor(message.guild.me)
				// 		.missing(clientCheck);
				// 	if (missing.length) {
				// 		await message.channel.sendTyping();
				// 		return message.reply(
				// 			`I'm Missing \`${formatArray(
				// 				missing.map(formatPerms)
				// 			)}\` Permission`
				// 		);
				// 	}
				// }
			}

			if (command.ownerOnly && !this.client.owners.includes(message.author.id))
				return;
			if (!this.client.cooldowns.has(command.name)) {
				this.client.cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const timestamps = this.client.cooldowns.set(command.name);
			const cdAmount = command.cooldown;
			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cdAmount;
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.reply(
						`Please wait **${timeLeft.toFixed(2)}** seconds!`
					);
				}
			}
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cdAmount);
			try {
				await command.exec(message, args);
			} catch (err) {
				this.client.logger.error(
					`An error occurred when trying to trigger MessageCreate event.\n\n${err}`,
					{ tag: "MessageError" }
				);
				return message.reply(`Oops, it seems I got a critical error.`);
			}
		}
	}
};
