const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Show Bot Help Command",
  type: "Info",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const Ping_Embed = new MessageEmbed().setColor("RANDOM");
    const Properties = interaction.client.setup.get(interaction.guild.id);
    if (interaction.channel.id !== Properties.ChannelID) {
      const Help_Embed = new Discord.MessageEmbed();

      Help_Embed.setAuthor({
        name: "List Of My Availabled Commands",
        iconURL:
          "https://cdn.discordapp.com/attachments/920028835125264414/922497837235863562/Venus_Profile.jpg",
      });
      Help_Embed.addFields([
        {
          name: "**Public Channel Commands [ By Using Slash Commands [/] ]**",
          value: "\u200B",
        },
      ]);
      Help_Embed.addFields([
        { name: `**${Prefix}Setup**`, value: "Setup The Music Channel To Use" },
      ]);
      Help_Embed.addFields([
        {
          name: `**${Prefix}Ping**`,
          value: "Sends Bot And API Ping",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Music Channel Commands [ By Using Slash Commands [/] ]**",
          value: "\u200B",
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Loop**",
          value: "Cycle Through DISABLED/SONG/QUEUE Loop Mode",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Lyrics**",
          value: "Sends The Current Playing Music Lyrics To Your DM",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Pause**",
          value: "Pause The Current Playing Music",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Resume**",
          value: "Resume The Current Playing Music",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Shuffle**",
          value: "Shuffles The Queue",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Skip**",
          value: "Skip The Current Playing Music",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Stop**",
          value: "Stop All Musics In Queue",
          inline: true,
        },
      ]);
      Help_Embed.addFields([
        {
          name: "**Volume [ Value 0-100 ]**",
          value: "Send The Current Playing Music Value Or Change It",
          inline: true,
        },
      ]);
      interaction.reply({ embeds: [Help_Embed], ephemeral: true });
    } else {
      Ping_Embed.setDescription(
        `**You Can't Use This Commmand Here , Use It In A Pubic Channel**`
      );
      interaction.reply({ embeds: [Ping_Embed], ephemeral: true });
    }
  },
};
