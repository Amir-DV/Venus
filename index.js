const { Client, Collection, MessageEmbed } = require('discord.js');
require('dotenv').config();

const client = new Client({
	intents: 32767,
	ws: { properties: { browser: 'Discord iOS' } },
});
const { Manager } = require('erela.jshyper');
const Spotify = require('erela.js-spotify');
const clientID = 'SpotifyClientID'; // clientID from your Spotify app
const clientSecret = 'SpotifyClientSecret'; // clientSecret from your Spotify app

const manager = new Manager({
	validUnresolvedUris: [
		'spotify.com', // only if your lavalink has spotify plugin
	],
	nodes: [
		// If you pass a object like so the "host" property is required
		{
			host: 'HostIP', // Optional if Lavalink is local
			port: 25588, // Optional if Lavalink is set to default
			password: 'lavalinkPassword', // Optional if Lavalink is set to default
		},
	],
	send(id, payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});
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
client.on('voiceStateUpdate', (oldState, newState) => {
	// if nobody left the channel in question, return.
	if (
		oldState.channelId !== oldState.guild.members.me.voice.channelId ||
		newState.channel
	)
		return;
	else {
		if (oldState.channel.members.size <= 1)
			oldState.guild.members.me.voice.disconnect();
	}
});
client.manager
	.on('nodeConnect', async (node) => {
		const Error_Embed = new MessageEmbed().setColor('RANDOM');

		const guild = await client.guilds.fetch('992300928067698759');
		const Channel = await guild.channels.fetch('1042083293065121882');

		Error_Embed.setTitle('**✔️NODE CONNECT✔️**');
		Error_Embed.setDescription(
			`**Node ${node.options.identifier} Connected!**`
		);

		await Channel.send({
			embeds: [Error_Embed],
		});
	})

	.on('trackStart', async (player, track) => {
		const Error_Embed = new MessageEmbed().setColor('BLACK');
		const Play_Embed = new MessageEmbed().setColor('RANDOM');
		const Properties = client.setup.get(player.guild);
		let SongQueue;
		try {
			SongQueue = {
				Title: track.title,
				Url: track.uri,
				Thumbnail: track.displayThumbnail('hqdefault'),
				Duration: getYoutubeLikeToDisplay(track.duration),
			};
		} catch {
			SongQueue = {
				Title: track.title,
				Url: track.uri,
				Thumbnail: track.thumbnail,
				Duration: getYoutubeLikeToDisplay(track.duration),
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
	})

	.on('queueEnd', (player) => {
		player.destroy();
	})
	.on('playerDestroy', (player) => {
		const Error_Embed = new MessageEmbed().setColor('BLACK');
		const Play_Embed = new MessageEmbed().setColor('BLACK');

		const Properties = client.setup.get(player.guild);

		const Channel = client.channels.cache.get(player.textChannel);
		Channel.messages
			.fetch(Properties.MessageID)
			.then(async (FetchedMessage) => {
				Play_Embed.setTitle('No Song Playing Currently');
				Play_Embed.setDescription(`[Support](${process.env.INV_LINK})`);
				Play_Embed.setColor('BLACK');
				Play_Embed.setFooter({ text: 'Made With ❤️' });
				Play_Embed.setImage(
					'https://cdn.discordapp.com/attachments/920028835125264414/920029015006388224/Venos_no_music.jpg'
				);

				await FetchedMessage.edit({
					content:
						'​​__**QUEUE LIST:**__ \n Join A Voice Channel And Queue Songs By Name Or Url In Here',
					embeds: [Play_Embed],
				}).catch(async (err) => {});
			});
	})
	.on('', async (player, initChannel, newChannel) => {
		console.log('hi');
		if (!newChannel) {
			if (player.queue.totalSize > 1) {
				await player.stop(player.queue.size);
				setTimeout(async () => {
					await player.stop();
				}, 1000);
			} else {
				await player.stop(player.queue.totalSize);
			}
		} else {
			await player.setVoiceChannel(newChannel);
			await player.pause(true);
			setTimeout(() => {
				player.pause(false);
			}, 1000);
		}
	})
	.on('nodeError', async (node, error) => {
		const Error_Embed = new MessageEmbed().setColor('RANDOM');

		const guild = await client.guilds.fetch('992300928067698759');
		const Channel = await guild.channels.fetch('1042083293065121882');

		Error_Embed.setTitle('**❌NODE ERROR❌**');
		Error_Embed.setDescription(
			`**Node ${node.options.identifier} had an error \n Error Name : ${error.name} \n Error Stack : ${error.stack} \n Error Message : ${error.message}**`
		);

		await Channel.send({
			embeds: [Error_Embed],
		});
	})
	.on('nodeDisconnect', async (node, reason) => {
		const Error_Embed = new MessageEmbed().setColor('RANDOM');

		const guild = await client.guilds.fetch('992300928067698759');
		const Channel = await guild.channels.fetch('1042083293065121882');

		Error_Embed.setTitle('**❌NODE DISCONNECTED❌**');
		Error_Embed.setDescription(
			`**Node ${node.options.identifier} DISCONNECTED! \n CODE : ${reason.code} \n Reason : ${reason.reason}}**`
		);

		await Channel.send({
			embeds: [Error_Embed],
		});
	})
	.on('nodeReconnect', async (node) => {
		const Error_Embed = new MessageEmbed().setColor('RANDOM');

		const guild = await client.guilds.fetch('992300928067698759');
		const Channel = await guild.channels.fetch('1042083293065121882');

		Error_Embed.setTitle('**✔️NODE RECONNECT✔️**');
		Error_Embed.setDescription(
			`**Node ${node.options.identifier} RECONNECTED!**`
		);

		await Channel.send({
			embeds: [Error_Embed],
		});
	})
	.on('trackError', async (player, track, payload) => {
		const Error_Embed = new MessageEmbed().setColor('RANDOM');

		const guild = await client.guilds.fetch('992300928067698759');
		const Channel = await guild.channels.fetch('1042083293065121882');

		Error_Embed.setTitle('**❌TRACK ERROR❌**');
		Error_Embed.setDescription(
			`**Track Name : ${track.title} \n Track Url : ${track.uri} \n ========== \n Error : ${payload.error} \n Exception: ${payload.exception} \n Guild Id : ${payload.guildId} \n OP : ${payload.op} \n Type : ${payload.type}**`
		);

		await Channel.send({
			embeds: [Error_Embed],
		});
	})
	.on('trackStuck', async (player, track, payload) => {
		const Error_Embed = new MessageEmbed().setColor('RANDOM');

		const guild = await client.guilds.fetch('992300928067698759');
		const Channel = await guild.channels.fetch('1042083293065121882');

		Error_Embed.setTitle('**❌TRACK STUCK❌**');
		Error_Embed.setDescription(
			`**Track Name : ${track.title} \n Track Url : ${track.uri} \n ========== \n Error : ${payload.error} \n Exception: ${payload.exception} \n Guild Id : ${payload.guildId} \n OP : ${payload.op} \n Type : ${payload.type}**`
		);

		await Channel.send({
			embeds: [Error_Embed],
		});
	})
	.on('playerDisconnect', async (player, oldchannel) => {
		player.destroy();
	});

client.on('raw', (d) => client.manager.updateVoiceState(d));

module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.setup = new Collection();

// Initializing the project
require('./handler')(client);

client.login(
	'Bot_Token'
);
