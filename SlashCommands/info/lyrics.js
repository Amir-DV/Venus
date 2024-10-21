const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "lyrics",
  description: "Show Lyrics Of Current Playing Music",
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
          "**You Need To Be Connected To A Voice Channel To See Music Lyrics**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot See Music Lyrics**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription(
          "**There Is No Music Playing To See Lyrics**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        const Title = await player.queue.current.title;
        let Lyrics;
        fetch(`https://some-random-api.ml/lyrics?title=${Title}`)
          .then((res) => res.json())
          .then((json) => {
            Lyrics = json.lyrics;
            for (let i = 0; i < Lyrics.length; i += 4000) {
              const toSend = Lyrics.substring(
                i,
                Math.min(Lyrics.length, i + 4000)
              );
              const LyricEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${Title}`)
                .setDescription(toSend);
              message.author.send({ embeds: [LyricEmbed] }).catch(async () => {
                await message.channel.send({ embeds: [Error] });
              });
            }
          })
          .catch(() => {
            Error_Embed.setDescription(
              "**There Was No Lyrics Found By That Music**"
            );
            interaction.reply({ embeds: [Error_Embed], ephemeral: true });
          });
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
