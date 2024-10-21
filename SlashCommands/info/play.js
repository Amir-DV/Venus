const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

function getYoutubeLikeToDisplay(millisec) {
	var seconds = (millisec / 1000).toFixed(0);
	var minutes = Math.floor(seconds / 60);
	var hours = '';
	if (minutes > 59) {
		hours = Math.floor(minutes / 60);
		hours = hours >= 10 ? hours : '0' + hours;
		minutes = minutes - hours * 60;
		minutes = minutes >= 10 ? minutes : '0' + minutes;
	}

	seconds = Math.floor(seconds % 60);
	seconds = seconds >= 10 ? seconds : '0' + seconds;
	if (hours != '') {
		return hours + ':' + minutes + ':' + seconds;
	}
	return minutes + ':' + seconds;
}

module.exports = {
	name: 'play',
	description: 'Play A Music Via Query Or Link',
	type: 'Music',
	options: [
		{
			name: 'query',
			description: 'Play A Music Via Query Or Link',
			type: 'STRING',
			required: true,
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const Play_Embed = new MessageEmbed().setColor('RANDOM');
		const Error_Embed = new MessageEmbed().setColor('RANDOM');
		const Link = interaction.options.getString('query');
		const Properties = interaction.client.setup.get(interaction.guild.id);
		const SetupChannel = interaction.guild.channels.cache.get(
			Properties.ChannelID
		);
		if (interaction.channel.id === Properties.ChannelID) {
			const VoiceChannel = interaction.member.voice.channel;
			if (!VoiceChannel) {
				Error_Embed.setDescription(
					'**You Need To Be Connected To A Voice Channel To Play Music**'
				);
				interaction.reply({ embeds: [Error_Embed], ephemeral: true });
				return;
			}
			if (interaction.guild.me.voice.channel) {
				if (VoiceChannel !== interaction.guild.me.voice.channel) {
					Error_Embed.setDescription(
						'**You Need To Be Connected To The Same Channel As Bot To Play Music**'
					);
					interaction.reply({ embeds: [Error_Embed], ephemeral: true });
					return;
				}
			}
			if (!interaction.guild.me.permissions.has('CONNECT')) {
				Error_Embed.setDescription(
					"**I Don't Have Enough Permission To CONNECT To The Voice Channel**"
				);
				interaction.reply({ embeds: [Error_Embed], ephemeral: true });
				return;
			}
			if (!interaction.guild.me.permissions.has('SPEAK')) {
				Error_Embed.setDescription(
					"I Don't Have Enough Permission To SPEAK In The Voice Channel"
				);
				interaction.reply({ embeds: [Error_Embed], ephemeral: true });
				return;
			}
			await interaction.deferReply({ ephemeral: true });

			const res = await client.manager.search({
				query: Link,
				source: 'yt' || 'spotify',
			});
			if (res.loadType === 'NO_MATCHES') {
				Error_Embed.setDescription(
					`**Didn't Find Any Music With That Query/Link**`
				);
				interaction.followUp({ embeds: [Error_Embed], ephemeral: true });
			} else if (res.loadType === 'LOAD_FAILED') {
				Error_Embed.setDescription(`**Failed To Load With That Query/Link**`);
				interaction.followUp({ embeds: [Error_Embed], ephemeral: true });
			} else if (res.loadType === 'SEARCH_RESULT') {
				const player = client.manager.create({
					guild: interaction.guild.id,
					voiceChannel: interaction.member.voice.channel.id,
					textChannel: interaction.channel.id,
					selfDeafen: true,
					volume: 50,
				});

				if (player.state !== 'CONNECTED') player.connect();

				player.queue.add(res.tracks[0]);
				Play_Embed.setDescription(
					`**Music __${res.tracks[0].title}__ Was Added To The Queue**`
				);
				interaction.followUp({
					embeds: [Play_Embed],
					ephemeral: true,
				});
				if (!player.playing && !player.paused && !player.queue.size)
					player.play();
				if (player.queue.size > 0) {
					const Play_Embed = new MessageEmbed().setColor('RANDOM');
					const Properties = client.setup.get(player.guild);
					let SongQueue;
					try {
						SongQueue = {
							Title: player.queue.current.title,
							Url: player.queue.current.uri,
							Thumbnail: player.queue.current.displayThumbnail('hqdefault'),
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
						queueMode = 'SONG';
					} else if (player.queueRepeat) {
						queueMode = 'QUEUE';
					} else {
						queueMode = 'DISABLED';
					}

					const Channel = client.channels.cache.get(player.textChannel);
					Channel.messages
						.fetch(Properties.MessageID)
						.then(async (FetchedMessage) => {
							Play_Embed.setAuthor({
								name: `[${SongQueue.Duration}] : ${SongQueue.Title}`,
								iconURL:
									'https://cdn.discordapp.com/emojis/729630163750354955.gif?v=1',
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
										.join('\n')} \n**And ${player.queue.size - 10} More**`,
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
										.join('\n')}`,
									embeds: [Play_Embed],
								}).catch(async (err) => {});
							}
						});
				}
			} else if (res.loadType === 'PLAYLIST_LOADED') {
				const player = client.manager.create({
					guild: interaction.guild.id,
					voiceChannel: interaction.member.voice.channel.id,
					textChannel: interaction.channel.id,
					selfDeafen: true,
					volume: 50,
				});

				if (player.state !== 'CONNECTED') player.connect();
				player.queue.add(res.tracks);
				const unresolvedTrack = TrackUtils.buildUnresolved({
					title: `${res.tracks[1].title}`,
					author: `${res.tracks[1].author}`,
					duration: res.tracks[1].duration,
				});

				Play_Embed.setDescription(
					`**Playlist __${res.playlist.name}__ Was Added To The Queue**`
				);
				interaction.followUp({
					embeds: [Play_Embed],
					ephemeral: true,
				});
				if (
					!player.playing &&
					!player.paused &&
					player.queue.totalSize === res.tracks.length
				)
					player.play();

				if (player.queue.size > 0) {
					const Play_Embed = new MessageEmbed().setColor('RANDOM');
					const Properties = client.setup.get(player.guild);
					let SongQueue;
					try {
						SongQueue = {
							Title: player.queue.current.title,
							Url: player.queue.current.uri,
							Thumbnail: player.queue.current.displayThumbnail('hqdefault'),
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
						queueMode = 'SONG';
					} else if (player.queueRepeat) {
						queueMode = 'QUEUE';
					} else {
						queueMode = 'DISABLED';
					}
					const Channel = client.channels.cache.get(player.textChannel);
					Channel.messages
						.fetch(Properties.MessageID)
						.then(async (FetchedMessage) => {
							Play_Embed.setAuthor({
								name: `[${SongQueue.Duration}] : ${SongQueue.Title}`,
								iconURL:
									'https://cdn.discordapp.com/emojis/729630163750354955.gif?v=1',
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
										.join('\n')} \n**And ${player.queue.size - 10} More**`,
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
										.join('\n')}`,
									embeds: [Play_Embed],
								}).catch(async (err) => {});
							}
						});
				}
			} else {
				const player = client.manager.create({
					guild: interaction.guild.id,
					voiceChannel: interaction.member.voice.channel.id,
					textChannel: interaction.channel.id,
					selfDeafen: true,
					volume: 50,
				});

				if (player.state !== 'CONNECTED') player.connect();

				player.queue.add(res.tracks[0]);
				Play_Embed.setDescription(
					`**Music __${res.tracks[0].title}__ Was Added To The Queue**`
				);
				interaction.followUp({
					embeds: [Play_Embed],
					ephemeral: true,
				});
				if (!player.playing && !player.paused && !player.queue.size)
					player.play();

				if (player.queue.size > 0) {
					const Play_Embed = new MessageEmbed().setColor('RANDOM');
					const Properties = client.setup.get(player.guild);
					let SongQueue;
					try {
						SongQueue = {
							Title: player.queue.current.title,
							Url: player.queue.current.uri,
							Thumbnail: player.queue.current.displayThumbnail('hqdefault'),
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
						queueMode = 'SONG';
					} else if (player.queueRepeat) {
						queueMode = 'QUEUE';
					} else {
						queueMode = 'DISABLED';
					}

					const Channel = client.channels.cache.get(player.textChannel);
					Channel.messages
						.fetch(Properties.MessageID)
						.then(async (FetchedMessage) => {
							Play_Embed.setAuthor({
								name: `[${SongQueue.Duration}] : ${SongQueue.Title}`,
								iconURL:
									'https://cdn.discordapp.com/emojis/729630163750354955.gif?v=1',
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
										.join('\n')} \n**And ${player.queue.size - 10} More**`,
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
										.join('\n')}`,
									embeds: [Play_Embed],
								}).catch(async (err) => {});
							}
						});
				}
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
