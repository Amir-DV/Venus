const client = require("../index");
const ChannelSchema = require("../Schemas/Channel");

client.on("ready", async() => {
    console.log(`${client.user.tag} is up and ready to go!`)
    await client.guilds.cache.forEach(async (guild) => {
		
		const result = await ChannelSchema.find({
			Guild_ID: guild.id,
		});
		if (result.length === 0) {
			const Channel = {
				Guild_ID: guild.id,
                Message_ID: " ",
				Channel_ID: " ",
				
			};
			await new ChannelSchema(Channel).save();
			await client.setup.set(guild.id, {MessageID : Channel.Message_ID , ChannelID : Channel.Channel_ID});
		} else {
            await client.setup.set(guild.id, {MessageID : result[0].Message_ID , ChannelID : result[0].Channel_ID});
		}
	});
});
