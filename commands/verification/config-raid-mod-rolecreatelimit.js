const Discord = require('discord.js');

module.exports = {
	name: 'config-rolecreatelimit',
	run: async (client, message, args, db) => {
		if (!message.channel.permissionsFor(message.author).has('MANAGE_GUILD'))
			return message.channel.send(
				":x: | **Vous n'êtes pas autorisé à utiliser cette commande!**"
			);

if (!args[0]) return message.channel.send(":x: | **Fournir La limite**")
if (isNaN(args[0])) return message.channel.send(":x: | **La limite doit être un nombre**")
if (Number(args[0]) < 1) return message.channel.send(":x: | **La limite ne peut pas être zéro ou un nombre négatif**")
db.set(`rolecreate_${message.guild.id}`, Number(args[0]))
return message.channel.send("**La limite de création de rôle a été définie sur " + Number(args[0]) + "**")

}

}