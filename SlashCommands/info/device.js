const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'device',
	description: 'Show Device',
	options: [
		{
			name: 'user',
			description: 'The User You Want To Get The Device',
			type: 'USER',
			required: true,
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const user = interaction.options.getUser('user');
		const Realuser = await interaction.guild.members.fetch(user.id);
		const devices = Realuser.presence?.clientStatus || {};
		console.log(devices);
		const description = () => {
			const entries = Object.entries(devices)
				.map(
					(value, index) =>
						`${index + 1}) ${value[0][0].toUpperCase()}${value[0].slice(1)} : ${
							value[1]
						}`
				)
				.join('\n');
			return `Devices:\n${entries}`;
		};
		const Ping_Embed = new MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(user.tag, user.displayAvatarURL())
			.setDescription(description());

		await interaction.deferReply({ ephemeral: true });
		interaction.followUp({ embeds: [Ping_Embed] });
	},
};
