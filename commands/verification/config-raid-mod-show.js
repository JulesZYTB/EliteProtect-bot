const Discord = require('discord.js');

module.exports = {
	name: 'config-show',
	run: async (client, message, args, db) => {
		if (!message.channel.permissionsFor(message.author).has('MANAGE_GUILD'))
			return message.channel.send(
				":x: | **Vous n'êtes pas autorisé à utiliser cette commande!**"
			);
		let disabled = ":x: Désactivée";
		
				let rcl = db.get(`rolecreate_${message.guild.id}`)
let rdl = db.get(`roledelete_${message.guild.id}`)
let ccl = db.get(`channelcreate_${message.guild.id}`)
let cdl = db.get(`channeldelete_${message.guild.id}`)
let bl = db.get(`banlimit_${message.guild.id}`)
let kl = db.get(`kicklimit_${message.guild.id}`)
let punish = db.get(`punish_${message.guild.id}`)
if (rcl === null) rcl = disabled
if (rdl === null) rdl = disabled
if (ccl === null) ccl = disabled
if (cdl === null) cdl = disabled
if (bl === null) bl = disabled
if (kl === null) kl = disabled


let show = new Discord.MessageEmbed()
.setTitle("**Anti-Raid | Configuration**")
.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
.setFooter(message.guild.name + " EliteProtect | Anti-Raid-Mode Protection de vos serveur", message.guild.iconURL())
.addField("Channel Create Limit", ccl)
.addField("Channel Delete Limit", cdl)
.addField("Role Create Limit", rcl)
.addField("Role Delete Limit", rdl)
.addField("Ban Limits", bl)
.addField("Kick Limits", kl)
.setColor("GREEN")
return message.channel.send({ embed: show })
				
	}
};
