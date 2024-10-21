const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Send Bot And Api Ping",
    type: 'Info',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const Ping_Embed = new MessageEmbed()
            .setColor('RANDOM')
        const Properties = interaction.client.setup.get(interaction.guild.id)
        if(interaction.channel.id !== Properties.ChannelID) {
			Ping_Embed.setDescription(
				`**⌛Bot Latency : ${
					Date.now() - interaction.createdTimestamp
				} MS! \n \n ⌛API Latency : ${client.ws.ping} MS!**`,
			);
            interaction.reply({ embeds: [Ping_Embed], ephemeral: true});

        } else {
            Ping_Embed.setDescription(
				`**You Can't Use This Commmand Here , Use It In A Pubic Channel**`
			);
            interaction.reply({ embeds: [Ping_Embed], ephemeral: true});
        }
			
    },
};
