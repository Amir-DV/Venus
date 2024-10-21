const { MessageEmbed } = require("discord.js");
const client = require("../index");
const play = require("../SlashCommands/info/play");

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
client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.reply({ content: "An error has occured " });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    cmd.run(client, interaction, args);
  }
  if (interaction.isButton()) {
    if (interaction.customId === "pause") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Pause Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Pause Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Pause**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.paused) {
        Error_Embed.setDescription("**Player Is Already Paused**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        await player.pause(true);

        Error_Embed.setDescription("**I Have Paused The Music ✅**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      }
    } else if (interaction.customId === "resume") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

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
    } else if (interaction.customId === "stop") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Stop Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Stop Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Stop**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        if (player.queue.totalSize > 1) {
          await player.stop(player.queue.size);
          setTimeout(async () => {
            await player.stop();
          }, 1000);
        } else {
          await player.stop(player.queue.totalSize);
        }

        Error_Embed.setDescription("**I Have Stopped The Music ✅**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      }
    } else if (interaction.customId === "skip") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Skip Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Skip Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Skip**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        if (player.queueRepeat) {
          player.queue.add(player.queue.current);
        }
        await player.stop();

        Error_Embed.setDescription("**I Have Skipped The Music ✅**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      }
    } else if (interaction.customId === "loop") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Loop Music**"
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
          "**You Need To Be Connected To The Same Channel As Bot To Loop Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        return;
      }
      if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Loop**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        return;
      }
      let queueMode;
      if (player.trackRepeat) {
        queueMode = "SONG";
      } else if (player.queueRepeat) {
        queueMode = "QUEUE";
      } else {
        queueMode = "DISABLED";
      }
      if (!player.queueRepeat && !player.trackRepeat) {
        player.setTrackRepeat(true);
        Error_Embed.setDescription("**Loop Changed To Track Repeat✅**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        const Play_Embed = new MessageEmbed().setColor("RANDOM");
        const Properties = client.setup.get(player.guild);
        if (player.trackRepeat) {
          queueMode = "SONG";
        } else if (player.queueRepeat) {
          queueMode = "QUEUE";
        } else {
          queueMode = "DISABLED";
        }
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
        return;
      }
      if (!player.queueRepeat && player.trackRepeat) {
        player.setTrackRepeat(false);
        player.setQueueRepeat(true);

        Error_Embed.setDescription("**Loop Changed To Queue Repeat✅**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        const Play_Embed = new MessageEmbed().setColor("RANDOM");
        const Properties = client.setup.get(player.guild);
        if (player.trackRepeat) {
          queueMode = "SONG";
        } else if (player.queueRepeat) {
          queueMode = "QUEUE";
        } else {
          queueMode = "DISABLED";
        }
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
        return;
      }
      if (player.queueRepeat && !player.trackRepeat) {
        player.setQueueRepeat(false);

        Error_Embed.setDescription("**Loop Changed To Disabled✅**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
        const Play_Embed = new MessageEmbed().setColor("RANDOM");
        const Properties = client.setup.get(player.guild);
        if (player.trackRepeat) {
          queueMode = "SONG";
        } else if (player.queueRepeat) {
          queueMode = "QUEUE";
        } else {
          queueMode = "DISABLED";
        }
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
        return;
      }
    } else if (interaction.customId === "shuffle") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Shuffle Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Shuffle Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Shuffle**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        await player.queue.shuffle();

        Error_Embed.setDescription("**I Have Shuffled The Queue ✅**");
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
    } else if (interaction.customId === "volume+10") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Shuffle Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Shuffle Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Shuffle**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.volume === 100) {
        Error_Embed.setDescription("**Maximum Volume Increase Is 100**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        await player.setVolume(player.volume + 10);

        Error_Embed.setDescription(`**Volume Changed To ${player.volume} ✅**`);
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
    } else if (interaction.customId === "volume-10") {
        const Error_Embed = new MessageEmbed().setColor("RANDOM");
      const Properties = interaction.client.setup.get(interaction.guild.id);
      const SetupChannel = interaction.guild.channels.cache.get(
        Properties.ChannelID
      );
      const player = client.manager.get(interaction.guild.id);

      const VoiceChannel = interaction.member.voice.channel;
      if (!VoiceChannel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To A Voice Channel To Shuffle Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (!interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Can't Use This Command While Bot Is Disconnected**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (VoiceChannel !== interaction.guild.me.voice.channel) {
        Error_Embed.setDescription(
          "**You Need To Be Connected To The Same Channel As Bot To Shuffle Music**"
        );
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.queue.totalSize === 0) {
        Error_Embed.setDescription("**There Is No Music Playing To Shuffle**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else if (player.volume === 0) {
        Error_Embed.setDescription("**Minimum Volume Decrease Is 0**");
        interaction.reply({ embeds: [Error_Embed], ephemeral: true });
      } else {
        await player.setVolume(player.volume - 10);

        Error_Embed.setDescription(`**Volume Changed To ${player.volume} ✅**`);
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
    } else if (interaction.customId === "addtoplaylist") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");

      Error_Embed.setDescription("**This Feature Will Be Added Soon ✅**");
      interaction.reply({ embeds: [Error_Embed], ephemeral: true });
    } else if (interaction.customId === "removefromplaylist") {
      const Error_Embed = new MessageEmbed().setColor("RANDOM");

      Error_Embed.setDescription("**This Feature Will Be Added Soon ✅**");
      interaction.reply({ embeds: [Error_Embed], ephemeral: true });
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});
