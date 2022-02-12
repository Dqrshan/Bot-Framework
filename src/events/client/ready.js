module.exports = class Ready extends Event {
	constructor(client) {
		super(client, {
			name: "ready",
			once: false,
		});
	}
	async exec() {
		this.client.logger.log(`Connected into ${this.client.user.tag}`, {
			tag: "Ready",
		});
		await this.client.loadInteractions();
	}
};
