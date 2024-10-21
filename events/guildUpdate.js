const client = require("../index");
const ChannelSchema = require("../Schemas/Channel");


client.on("guildCreate", async (guild) => {

	const Channel = {
		Guild_ID: guild.id,
        Message_ID: " ",
		Channel_ID: " ",
	};

	await new ChannelSchema(Channel).save()

    await client.setup.set(guild.id, {MessageID : Channel.Message_ID , ChannelID : Channel.Channel_ID});
});

client.on("guildDelete", async (guild) => {
	await ChannelSchema.deleteOne({
		Guild_ID: guild.id,
	})
	await client.setup.delete(guild.id)

});