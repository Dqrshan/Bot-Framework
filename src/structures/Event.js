const Discord = require("discord.js");
const { Bot } = require("./Bot");
/**
 * @template {keyof Discord.ClientEvents} K
 */
class Event {
	/**
	 * @typedef {Object} EventOptions
	 * @property {K} [name] - Event name
	 * @property {boolean} [once=false] - Event once
	 */
	/**
	 * @param {Bot} client
	 * @param {EventOptions} options
	 */
	constructor(client, options) {
		/**
		 * The main client
		 * @type {Bot}
		 */
		this.client = client;

		/**
		 * Event name
		 * @type {K}
		 */
		this.name = options.name || "";

		/**
		 * Event once
		 * @type {?Boolean}
		 */
		this.type = options.once || false;
	}
	/**
	 * @param  {Discord.ClientEvents[K]} args
	 */
	async exec(...args) {
		throw new Error(`${this.name} does not provide exec method !`);
	}
}

module.exports = Event;
