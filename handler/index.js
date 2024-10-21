const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
	// Commands
	const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
	commandFiles.map((value) => {
		const file = require(value);
		const splitted = value.split('/');
		const directory = splitted[splitted.length - 2];

		if (file.name) {
			const properties = { directory, ...file };
			client.commands.set(file.name, properties);
		}
	});

	// Events
	const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
	eventFiles.map((value) => require(value));

	// Slash Commands
	const slashCommands = await globPromise(
		`${process.cwd()}/SlashCommands/*/*.js`
	);

	const arrayOfSlashCommands = [];
	slashCommands.map((value) => {
		const file = require(value);
		if (!file?.name) return;
		client.slashCommands.set(file.name, file);

		if (['MESSAGE', 'USER'].includes(file.type)) delete file.description;
		arrayOfSlashCommands.push(file);
	});
	client.on('ready', async () => {
		// Register for a single guild
		// await client.guilds.cache
		//     .get("922460870737526824")
		//     .commands.set(arrayOfSlashCommands);
		let counter = 0;

		setInterval(async () => {
			const Activities = [
				'Slash Command | V2.0',
				`${client.guilds.cache.size} Servers | V2.0`,
				`${client.guilds.cache.reduce(
					(a, b) => a + b.memberCount,
					0
				)} Users | V2.0`,
			];
			await client.user.setActivity(`${Activities[counter]}`, {
				type: 'WATCHING',
			});
			counter += 1;
			if (counter >= Activities.length) {
				counter = 0;
			}
		}, 20000);
		// Register for all the guilds the bot is in
		await client.application.commands.set(arrayOfSlashCommands);
		client.manager.init(client.user.id);
	});

	// mongoose
	const mongooseConnectionString =
		'MongoDBconnectionString';
	if (!mongooseConnectionString) return;

	mongoose
		.connect(mongooseConnectionString, { keepAlive: true })
		.then(() => console.log('Connected to mongodb'))
		.catch(() =>
			console.log(
				' \n❌ Couldnt Connect To MonGo DB , Please Check For The Problem'
			)
		);
};
