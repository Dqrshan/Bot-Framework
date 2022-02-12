const { Message } = require("discord.js");
const { Bot } = require("./Bot");

class Command {
	/**
	 * @typedef {Object} CommandOptions
	 * @property {string} [name] - Name of the command
	 * @property {string} [description] - Description of the command
	 * @property {string} [usage] - Usage of the command {Optional}
	 * @property {string[]} [aliases=[]] - Aliases of the command {Optional}
	 * @property {boolean} [ownerOnly=false] - Owner condition
	 * @property {number} [cooldown] - Timeout of the command
	 * @property {string} [category] - Group of the command
	 * @property {import("discord.js").PermissionResolvable[]} [permissions=[]] - Permissions required for the user to execute command
	 */
	/**
	 * @param {Bot} client
	 * @param {CommandOptions} options
	 */
	constructor(client, options) {
		/**
		 * The main client
		 * @type {Bot}
		 */
		this.client = client;

		/**
		 * The name of command
		 * @type {string}
		 */
		this.name = options.name;

		/**
		 * Aliases of command
		 * @type {?string[]}
		 */
		this.aliases = options.aliases;

		/**
		 * Description of command
		 * @type {string}
		 */
		this.description = options.description;

		/**
		 * Usage of command
		 * @type {?string}
		 */
		this.usage = options.usage;

		/**
		 * Category of command
		 * @type {?string}
		 */
		this.category = options.category || "Misc";

		/**
		 * Owner only condition
		 * @type {?boolean}
		 */
		this.ownerOnly = Boolean(options.ownerOnly) || false;

		/**
		 * Cooldown of command
		 * @type {number}
		 */
		this.cooldown = Number(options.cooldown) || 2000;

		/**
		 * Permissions of user
		 * @type {import("discord.js").PermissionResolvable[]}
		 */
		this.permissions = options.permissions;
	}

	/**
	 * Run Function
	 * @param {Message} message
	 * @param {String[]} args
	 * @returns {Promise<?Message>}
	 * @abstract
	 */
	async exec(message, args) {
		throw new Error(`${this.name} does not provide exec method !`);
	}
}

module.exports = Command;
