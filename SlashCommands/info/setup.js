const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const ChannelSchema = require("../../Schemas/Channel");

module.exports = {
  name: "setup",
  description: "Setup The Music Channel To Use",
  type: "Music",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const Setup_Embed = new MessageEmbed().setColor("RANDOM");

    // if (!interaction.member.permissions.has("ADMINISTRATOR")) {
    // 	MessageEmbed.setTitle("Just ADMINSTRATOR Can Setup The Bot");
    // 	message.reply({ embeds: [MessageEmbed] });
    // 	return;
    // }
    if (
      !interaction.guild.me.permissions.has("VIEW_CHANNEL") ||
      !interaction.guild.me.permissions.has("EMBED_LINKS") ||
      !interaction.guild.me.permissions.has("MANAGE_CHANNELS") ||
      !interaction.guild.me.permissions.has("ADD_REACTIONS") ||
      !interaction.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") ||
      !interaction.guild.me.permissions.has("ATTACH_FILES")
    ) {
      Setup_Embed.setDescription(
        "**I Dont Have Enough Permission , Try Again After Giving Me Default Bot Permissions**"
      );
      interaction.reply({ embeds: [Setup_Embed], ephemeral: true });
      return;
    }

    let CurrentChannel = await ChannelSchema.find({
      Guild_ID: interaction.guild.id,
    });
    CurrentChannel = CurrentChannel[0].Channel_ID;
    const SetupChannel = interaction.guild.channels.cache.get(CurrentChannel);

    if (!SetupChannel) {
      const Channel = await interaction.guild.channels
        .create("🪐᲼ＶＥＮＵＳ᲼🪐", {
          type: "text",
          topic:
            ":play_pause: Pause/Resume the song.\n :stop_button: Stop and empty the queue.\n :track_next: Skip the song.\n :arrows_counterclockwise: Loop The Music.\n :twisted_rightwards_arrows: Shuffle The Current Queue.\n :white_check_mark: Add Current Song To Your Private Playlist.\n :x: Remove Current Song From Your Private Playlist",
        })
        .catch((err) => {
          console.log(err);
          Setup_Embed.setDescription(
            `**There Was A Problem Setting Up The Bot \n Error : ${err} \n If You Keep Getting This Error , Please Let Us Know**`
          );
          interaction.reply({ embeds: [Setup_Embed], ephemeral: true });
        });
      await Channel.send(
        "https://cdn.discordapp.com/attachments/920028835125264414/920029014737956904/banner.jpg"
      ).catch((err) => {
        console.log(err);
        Setup_Embed.setDescription(
          `**There Was A Problem Setting Up The Bot \n Error : ${err} \n If You Keep Getting This Error , Please Let Us Know**`
        );
        interaction.reply({ embeds: [Setup_Embed], ephemeral: true });
      });
      const Channel_Message_Embed = new MessageEmbed()

        .setTitle("No Song Playing Currently")
        .setDescription(`[Support](${process.env.INV_LINK})`)
        .setFooter({ text: "Made With ❤️" })
        .setImage(
          "https://cdn.discordapp.com/attachments/920028835125264414/920029015006388224/Venos_no_music.jpg"
        );

      const row1 = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("pause")
          .setStyle("PRIMARY")
          .setLabel("Pause")
          .setEmoji("⏸️")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("resume")
          .setStyle("PRIMARY")
          .setLabel("Resume")
          .setEmoji("▶️")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("stop")
          .setStyle("PRIMARY")
          .setLabel("Stop")
          .setEmoji("⏹️")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("skip")
          .setStyle("PRIMARY")
          .setLabel("Skip")
          .setEmoji("⏭️")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("loop")
          .setStyle("PRIMARY")
          .setLabel("Loop")
          .setEmoji("🔄")
          .setStyle("PRIMARY")
      );
      const row2 = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("shuffle")
          .setStyle("PRIMARY")
          .setLabel("Shuffle")
          .setEmoji("🔀")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("volume+10")
          .setStyle("PRIMARY")
          .setLabel("Volume Up")
          .setEmoji("🔊")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("volume-10")
          .setStyle("PRIMARY")
          .setLabel("Volume Down")
          .setEmoji("🔉")
          .setStyle("PRIMARY")
      );
      const row3 = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("addtoplaylist")
          .setStyle("PRIMARY")
          .setLabel("Add To Playlist")
          .setEmoji("✅")
          .setStyle("SUCCESS"),
        new MessageButton()
          .setCustomId("removefromplaylist")
          .setStyle("PRIMARY")
          .setLabel("Remove From Playlist")
          .setEmoji("❌")
          .setStyle("DANGER")
      );
      await Channel.send({
        content:
          "​​__**QUEUE LIST:**__ \n Join A Voice Channel And Queue Songs By Name Or Url In Here",
        embeds: [Channel_Message_Embed],
        components: [row1, row2, row3],
      }).then(async (AfkEmbed) => {
        try {
          await ChannelSchema.updateOne(
            {
              Guild_ID: interaction.guild.id,
            },
            {
              Guild_ID: interaction.guild.id,
              Message_ID: AfkEmbed.id,
              Channel_ID: Channel.id,
            }
          );
          Setup_Embed.setDescription("**Updated Bot Setup :** ✅");
          interaction.reply({ embeds: [Setup_Embed], ephemeral: true });

          await interaction.client.setup.set(interaction.guild.id, {
            MessageID: AfkEmbed.id,
            ChannelID: Channel.id,
          });
        } catch (err) {
          console.log(err);
          Setup_Embed.setDescription(
            `**There Was A Problem Setting Up The Bot \n Error : ${err} \n If You Keep Getting This Error , Please Let Us Know**`
          );
          interaction.reply({ embeds: [Setup_Embed], ephemeral: true });
          return;
        }
      });
    } else {
      Setup_Embed.setDescription(
        `**You Can Use Music Commands In  =>** ${SetupChannel}`
      );
      interaction.reply({ embeds: [Setup_Embed], ephemeral: true });
    }
  },
};
