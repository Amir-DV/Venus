const client = require('../index');
require('dotenv').config();

client.on('messageCreate', async (message) => {
	const Properties = message.client.setup.get(message.guild.id);
	if (!Properties) return;
	if (message.channel.id === Properties.ChannelID) {
		try {
			message.channel.messages.fetch().then((message) =>
				setTimeout(() => {
					message.delete();
				}, 3000)
			);
		} catch {
			return;
		}
	}
});
