const Discord = require('discord.js');

module.exports = {
	name: 'config',
	run: async (client, message, args, db) => {
		if (!message.channel.permissionsFor(message.author).has('MANAGE_GUILD'))
			return message.channel.send(
				":x: | **Vous n'êtes pas autorisé à utiliser cette commande!**"
			);
		let options = ['warningchannel', 'logs', 'punishment', 'role', 'show', 'toggle'];
		function check(opt, array) {
			return array.some(x => x.toLowerCase() === opt.toLowerCase());
		}
		if (!args[0]) {
			return message.channel.send(
				`:x: | **Spécifiez une option, Les options sont - ${options.join(', ')}**`
			);
		}
		if (!check(args[0], options)) {
			return message.channel.send(
				`:x: | **Les seules options sont ${options.join(', ')}**`
			);
		}
		let channel = message.mentions.channels.first();
		switch (args[0]) {
			case 'warningchannel':
				if (!channel) {
					return message.channel.send(':x: | **Spécifiez le channel**');
				}
				db.set(`warningchannel_${message.guild.id}`, channel.id);
				return message.channel.send("**Le channel d'avertissement a été défini**");
				break;
			case 'logs':
				if (!channel) {
					return message.channel.send(':x: | **Spécifiez le canal**');
				}
				db.set(`logs_${message.guild.id}`, channel.id);
				return message.channel.send('**Le channel des journaux a été défini**');
				break;
			case 'role':
				let role =
					message.mentions.roles.first() ||
					message.guild.roles.cache.get(args[1]);
				if (!role) {
					return message.channel.send(':x: | **Précisez le rôle**');
				}
				db.set(`role_${message.guild.id}`, role.id);
				return message.channel.send('**Le rôle de vérification a été défini**');
				break;
			case 'show':
				let warningChan =
					message.guild.channels.cache.get(
						db.get(`warningchannel_${message.guild.id}`)
					) || 'None';
				let logsChan =
					message.guild.channels.cache.get(
						db.get(`logs_${message.guild.id}`)
					) || 'None';
				let verificationRole =
					message.guild.roles.cache.get(db.get(`role_${message.guild.id}`)) ||
					'None';
				let punish = db.get(`punishment_${message.guild.id}`) || 'None';
				let embed = new Discord.MessageEmbed()
					.setTitle('Configuration')
					.setDescription(
						'La configuration de ce serveur est affichée ci-dessous'
					)
					.addField('Châtiment', punish)
					.addField('Warning Channel', warningChan)
					.addField('logs Channel', logsChan)
					.addField('Verification Role', verificationRole)
					.setColor('RANDOM')
					.setFooter(
						message.guild.name + '✨ | EliteProtect',
						message.guild.iconURL({ dynamic: true })
					);
				return message.channel.send({ embed: embed });
				break;
			case 'punishment':
				const punishment = args[1].toLowerCase().trim();
				const punishments = ['kick', 'ban'];
				if (!punishment)
					return message.channel.send(' Veuillez saisir une punition ');
				if (!punishments.includes(punishment))
					return message.channel.send(
						`L'argument **punition** doit être l'un de ces:\n${punishments
							.map(x => `**${x}**`)
							.join(', ')}`
					);
				db.set(`punishment_${message.guild.id}`, punishment);
				return message.channel.send(`Les punition de **${message.guild.name}** a été mis à: **${punishment}**`
				);
				break;
		}
	}
};
