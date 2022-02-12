const { Bot } = require("./Bot");

class Interaction {
	/**
	 * @typedef {Object} CommandOptions
	 * @property {string} [name] - Name of the interaction
	 * @property {string} [description] - Description of the interaction
	 * @property {number} [type=1] - Type of the interaction
	 * '1' : Chat Input
	 * '2' : User
	 * '3' : Message
	 * @property {import("discord.js").ApplicationCommandOptionData[]} [options] - Options of the interaction
	 * @property {import("discord.js").PermissionResolvable[]} [permissions=[]] - Permissions required for the user to execute command
	 */
	/**
	 * @param {Bot} client
	 * @param {*} options
	 */
	constructor(client, options) {
		/**
		 * The main client
		 * @type {Bot}
		 */
		this.client = client;

		/**
		 * Name of the interaction
		 * @type {string}
		 */
		this.name = options.name;

		/**
		 * Type of the interaction
		 * @type {number}
		 * @see line:8
		 */
		this.type = options.type || 1;

		/**
		 * Description of the interaction
		 * @type {string}
		 */
		this.description =
			this.type === 1
				? options.description || "No description provided"
				: undefined;

		/**
		 * Options of the interaction
		 * @type {import("discord.js").ApplicationCommandOptionData[]}
		 */
		this.options = options.options || [];

		/**
		 * Permissions required to execute
		 * @type {import("discord.js").PermissionResolvable[]}
		 */
		this.permissions = options.permissions;
	}

	/**
	 * Run Function
	 * @param {Interaction} interaction
	 * @returns {Promise<?Interaction>}
	 * @abstract
	 */
	async exec(interaction) {
		throw new Error(`${this.name} does not provide exec method !`);
	}
}

module.exports = Interaction;
