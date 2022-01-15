const Discord = require('discord.js');

module.exports = {
	name: 'config-punition',
	run: async (client, message, args, db) => {
		if (!message.channel.permissionsFor(message.author).has('MANAGE_GUILD'))
			return message.channel.send(
				":x: | **Vous n'êtes pas autorisé à utiliser cette commande!**"
			);



				const punishment = args[0].toLowerCase().trim();

				const punishments = ['kick', 'ban', 'demote'];

				if (!punishment)

					return message.channel.send(' Veuillez saisir une punition ');

				if (!punishments.includes(punishment))

					return message.channel.send(

						`L'argument **punition** doit être l'un de ces:\n${punishments

							.map(x => `**${x}**`)

							.join(', ')}`

					);

				db.set(`punish_${message.guild.id}`, punishment);

				return message.channel.send(`Les punition de **${message.guild.name}** a été mis à: **${punishment}**`

				);

}}