const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
function getYoutubeLikeToDisplay(millisec) {
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = Math.floor(seconds / 60);
  var hours = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = hours >= 10 ? hours : "0" + hours;
    minutes = minutes - hours * 60;
    minutes = minutes >= 10 ? minutes : "0" + minutes;
  }

  seconds = Math.floor(seconds % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  if (hours != "") {
    return hours + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
}
module.exports = {
  name: "volume",
  description: "Shows The Volume Or Change It",
  type: "Music",
  options: [
    {
      name: "number",
      description: "Shows The Volume Or Change It",
      type: "STRING",
      required: false,
    },
  ],
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
          "**You Need To Be Connected To A Voice Channel To Manage Music Volume**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        return;
      }
      if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        return;
      }
      if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Manage Music Volume**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        return;
      }
      if (player.queue.totalSize === 0) {
        Error_Embed.setDescription(
          "**There Is No Music Playing To Manage Music Volume**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        return;
      }
      if (!args[0]) {
        Error_Embed.setDescription(`**Current Volume Is ${player.volume}**`);
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        return;
      }
      if (args[0] > 100 || args[0] < 0) {
        Error_Embed.setDescription(
          "**Please Choose A Valid Number Between 0-100**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        await player.setVolume(args[0]);

        Error_Embed.setDescription(`**Volume Changed To ${args[0]} ✅**`);
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });

        const Play_Embed = new MessageEmbed().setColor("RANDOM");
        const Properties = client.setup.get(player.guild);
        let SongQueue;
        try {
          SongQueue = {
            Title: player.queue.current.title,
            Url: player.queue.current.uri,
            Thumbnail: player.queue.current.displayThumbnail("hqdefault"),
            Duration: getYoutubeLikeToDisplay(player.queue.current.duration),
          };
        } catch {
          SongQueue = {
            Title: player.queue.current.title,
            Url: player.queue.current.uri,
            Thumbnail: player.queue.current.thumbnail,
            Duration: getYoutubeLikeToDisplay(player.queue.current.duration),
          };
        }

        let queueMode;
        if (player.trackRepeat) {
          queueMode = "SONG";
        } else if (player.queueRepeat) {
          queueMode = "QUEUE";
        } else {
          queueMode = "DISABLED";
        }

        const Channel = client.channels.cache.get(player.textChannel);
        Channel.messages
          .fetch(Properties.MessageID)
          .then(async (FetchedMessage) => {
            Play_Embed.setAuthor({
              name: `[${SongQueue.Duration}] : ${SongQueue.Title}`,
              iconURL:
                "https://cdn.discordapp.com/emojis/729630163750354955.gif?v=1",
              url: `${SongQueue.Url}`,
            });
            Play_Embed.setImage(SongQueue.Thumbnail);
            Play_Embed.setFooter({
              text: `Music Queue : ${player.queue.size} | Volume : ${player.volume} | Loop : ${queueMode} `,
            });
            if (player.queue.size > 10) {
              await FetchedMessage.edit({
                content: `__**QUEUE LIST:**__\n${player.queue
                  .map(
                    (Song, Index) =>
                      `**${Index + 1} - **${
                        Song.title
                      } - [${getYoutubeLikeToDisplay(Song.duration)}]`
                  )
                  .slice(0, 10)
                  .join("\n")} \n**And ${player.queue.size - 10} More**`,
                embeds: [Play_Embed],
              }).catch(async (err) => {});
            } else {
              await FetchedMessage.edit({
                content: `__**QUEUE LIST:**__\n${player.queue
                  .map(
                    (Song, Index) =>
                      `**${Index + 1} - **${
                        Song.title
                      } - [${getYoutubeLikeToDisplay(Song.duration)}]`
                  )
                  .slice(0)
                  .join("\n")}`,
                embeds: [Play_Embed],
              }).catch(async (err) => {});
            }
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
