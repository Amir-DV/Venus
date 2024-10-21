const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  description: "Resume The Current Playing Music",
  type: "Music",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const Error_Embed = new MessageEmbed().setColor("RANDOM");
    const Properties = interaction.client.setup.get(interaction.guild.id);
    const SetupChannel = interaction.guild.channels.cache.get(
      Properties.ChannelID
    );
    const player = client.manager.get(interaction.guild.id);

    if (interaction.channel.id === Properties.ChannelID) {
      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Resume Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Resume Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Resume**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!player.paused) {
        Error_Embed.setDescription("**Player Is Already Resumed**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        await player.pause(false);

        Error_Embed.setDescription("**I Have Resumed The Music ✅**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        
      }
    } else {
      if (!SetupChannel) {
        Error_Embed.setDescription(
          `**There Is No Music Channel , Create With => /setup**`
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        Error_Embed.setDescription(
          `**You Can't Use This Commmand Here , Its Limited To => ${SetupChannel}**`
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      }
    }
  },
};
