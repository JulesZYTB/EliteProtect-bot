
const Client = require('./Structures/legendJsClient.js'),
	Discord = require('discord.js'),
	{ prefix: defaultPrefix, token } = require('./config').bot,
	client = new Client({ disableMentions: 'everyone' }),
	db = require('quick.db'),
	dashboard = require('./dashboard/index'),
	moment = require('moment'),
	config = require('./config');

client.loadCommands();

console.log('-------------------------------------');
console.log(`
██╗     ███████╗ ██████╗ ███████╗███╗   ██╗██████╗         ██╗███████╗
██║     ██╔════╝██╔════╝ ██╔════╝████╗  ██║██╔══██╗        ██║██╔════╝
██║     █████╗  ██║  ███╗█████╗  ██╔██╗ ██║██║  ██║        ██║███████╗
██║     ██╔══╝  ██║   ██║██╔══╝  ██║╚██╗██║██║  ██║   ██   ██║╚════██║
███████╗███████╗╚██████╔╝███████╗██║ ╚████║██████╔╝██╗╚█████╔╝███████║
╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝ ╚════╝ ╚══════╝
`);

console.log('-------------------------------------');
console.log(
	'[CREDITS]: Créé par JulesZ YTB https://youtube.com/c/julesZYTB'
);

console.log('-------------------------------------');
//this took me some time so dont you dare remove credits, if u do remove credits then you will have copy right issues.
client.on('ready', () => {
	console.log(`[INFO]: Ready on client (${client.user.tag})`);
	console.log(
		`[INFO]: watching ${client.guilds.cache.size} Servers, ${
			client.channels.cache.size
		} channels & ${client.users.cache.size} users`
	);
	console.log('-------------------------------------');
	
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	let prefix = db.get(`prefix_${message.guild.id}`) || defaultPrefix;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member)
		message.member = await message.guild.members.fetch(message);

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (command) command.run(client, message, args, db);
});

client.on('guildMemberAdd', async member => {
	
    let { guild, user } = member;
	if (db.get(`warningchannel_${member.guild.id}`) === null) return;
        
        if (db.get(`logs_${member.guild.id}`) === null) return;
        
        if (db.get(`role_${member.guild.id}`) === null) return;
	
	

	let prefix = db.get(`prefix_${member.guild.id}`) || defaultPrefix;
	let bypassed = db.get(`bypass_${guild.id}`) || [];
	if (bypassed.includes(user.id)) return;
	let warningChan = member.guild.channels.cache.get(
		db.get(`warningchannel_${member.guild.id}`)
	);
	let logsChan = member.guild.channels.cache.get(
		db.get(`logs_${member.guild.id}`)
	);

	let embed = new Discord.MessageEmbed()
		.setTitle(`Vérification Logs`)
		.setDescription(`Membre rejoint`)
		.setFooter(member.guild.name, member.guild.iconURL())
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.addField(`Membre`, `<@${member.user.id}> (${member.user.id})`)
		.addField(
			`L'âges du compte`,
			`Crée il à ${moment(member.user.createdAt).fromNow()}`
		)
		.setColor(
			`${
				Date.now() - member.user.createdAt < 60000 * 60 * 24 * 7
					? '#FF0000'
					: '#00FF00'
			}`
		); //sets the color to red if the account age is less then a week else it sets it to green
	logsChan.send({ embed: embed }).catch(err => {});
	member.user
		.send(
			`Bonjour ${member.user.username},
Bienvenue chez ${member.guild.name}. Ce serveur est protégé par ${
				client.user.username
			}. Pour vérifier votre compte, veuillez visiter http://${
				config.website.domain
			}/verify/${member.guild.id}\nVous avez 15 minutes pour terminer la vérification !


Bien cordialement, l'équipe de staff de ${member.guild.name} `
		)
		.catch(err => {
			warningChan.send(
				`salut <@${
					member.user.id
				}>, il semble que vos DM soient désactivés, veuillez les activer et utiliser la commande \`${prefix}verify\` `
			);
		});
	warningChan
		.send(
			`salut <@${
				member.user.id
			}>, pour participer à ce serveur, vous devez vérifier votre compte. Veuillez lire attentivement le DM que je vous ai envoyé. Vous avez 15 minutes pour terminer la vérification!`
		)
		.catch(err => {});
	//totally didnt steal these messages from AltDentifier
	setTimeout(function() {
		if (!member) return;
		if (db.get(`verified_${guild.id}_${user.id}`) || false) {
			return;
		} else {
			let kicked = true;
			member.user
				.send('Vous avez été expulsé du serveur pour ne pas avoir répondu!')
				.catch(err => {});
			member.kick().catch(err => {
				kicked = false;
			});
			let embed = new Discord.MessageEmbed()
				.setTitle(`Vérification Logs`)
				.setDescription(`Membre kicked`)
				.setFooter(member.guild.name, member.guild.iconURL())
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.addField(`Membre`, `<@${member.user.id}> (${member.user.id})`)
				.addField('Raison', 'Membre à pas répondu a la vérification')
				.setColor('#00FF00');

			let embed2 = new Discord.MessageEmbed()
				.setTitle(`Vérification Logs`)
				.setDescription(`Échec du hcaptcha du membre`)
				.setFooter(member.guild.name, member.guild.iconURL())
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.addField(`Membre`, `<@${member.user.id}> (${member.user.id})`)
				.addField('Raison', 'Membre à pas répondu')
				.setColor('#FF0000');
			if (kicked) return logsChan.send({ embed: embed });
			else return logsChan.send({ embed: embed2 });
		}
	}, 60000 * 15);
});



client.on("roleCreate", async role => {
  if (role.managed === true) return;
  const log = await role.guild.fetchAuditLogs({
        type: 'ROLE_CREATE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${role.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${role.guild.id}_${user.id}_rolecreate`)
    let limit = db.get(`rolecreate_${role.guild.id}`)
    if (limit === null) {
      return;
    }p
    let logsID = db.get(`logs_${role.guild.id}`)
    let punish = db.get(`punish_${role.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    if(person > limit - 1) {
      if (punish === "ban") {
        role.guild.members.ban(user.id).then(bruhmoment => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le rôle créer des limites")
          .addField("punition", punish)
          .addField("Bannie", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le rôle créer des limites")
          .addField("Punition", punish)
          .addField("Bannie", "Non")
          .setColor("#FF0000")
          if (logs) {
            return logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        role.guild.members.cache.get(user.id).kick().then(bruhlol => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le rôle créer des limites")
          .addField("Punition", punish)
          .addField("kick", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le rôle créer des limites")
          .addField("Punition", punish)
          .addField("kick", "Non")
          .setColor("#FF0000")
          if (logs) {
            return logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        role.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            role.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(bruhlolxd => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le rôle créer des limites")
          .addField("Punition", punish)
          .addField("demoted", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | Rupture de rôle crée des limites")
          .addField("Punition", punish)
          .addField("demoted", "Non")
          if (logs) {
            return logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${role.guild.id}_${user.id}_rolecreate`, 1)
       let pog = db.get(`${role.guild.id}_${user.id}_rolecreate`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Création de rôles...")
          .addField("Punition", punish)
          .addField("Times", `${pog || 0}/${limit || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
});

client.on("roleDelete", async role => {
  if (role.managed === true) return;
  const log = await role.guild.fetchAuditLogs({
        type: 'ROLE_DELETE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${role.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${role.guild.id}_${user.id}_roledelete`)
    let limit = db.get(`roledelete_${role.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${role.guild.id}`)
    let punish = db.get(`punish_${role.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    if(person > limit - 1) {
      if (punish === "ban") {
        role.guild.members.ban(user.id).then(xdbruhlol => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid*")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de rôle")
          .addField("Punition", punish)
          .addField("Bannie", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de rôle")
          .addField("Punition", punish)
          .addField("Bannie", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        role.guild.members.cache.get(user.id).kick().then(xdbruhlolmoment => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de rôle")
          .addField("Punition", punish)
          .addField("kick", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + " EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de rôle")
          .addField("Punition", punish)
          .addField("kick", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        role.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            role.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(bruhmomentlolxd => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de rôle")
          .addField("Punition", punish)
          .addField("demoted", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | Briser les limites de suppression de rôle")
          .addField("Punition", punish)
          .addField("demoted", "Non")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${role.guild.id}_${user.id}_roledelete`, 1)
       let pog = db.get(`${role.guild.id}_${user.id}_roledelete`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(role.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", role.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Suppression de rôles...")
          .addField("Punition", punish)
          .addField("Times", `${pog || 0}/${limit || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
});

client.on("channelCreate", async channel => {
  const log = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_CREATE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${channel.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${channel.guild.id}_${user.id}_channelcreate`)
    let limit = db.get(`channelcreate_${channel.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${channel.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    let punish = db.get(`punish_${channel.guild.id}`)
    if(person > limit - 1) {
      if (punish === "ban") {
        channel.guild.members.ban(user.id).then(hshshshs => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le canal créer des limites")
          .addField("Punition", punish)
          .addField("Bannie", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le Channel créer des limites")
          .addField("Punition", punish)
          .addField("Bannie", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        channel.guild.members.cache.get(user.id).kick().then(jsisj => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le channel créer des limites")
          .addField("Punition", punish)
          .addField("kick", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le channel créer des limites")
          .addField("Punition", punish)
          .addField("kick", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        channel.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            channel.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(hrh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser le Channel créer des limites")
          .addField("Punition", punish)
          .addField("demoted", "Oui")
          .setColor("GREEN")
          if (logs) {
            return logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | Briser le Channel crée des limites")
          .addField("Punition", punish)
          .addField("demoted", "Non")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${channel.guild.id}_${user.id}_channelcreate`, 1)
       let pog = db.get(`${channel.guild.id}_${user.id}_channelcreate`)
       let bruh = db.get(`channelcreate_${channel.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Création de channel...")
          .addField("Punition", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
})

client.on("channelDelete", async channel => {
  const log = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_DELETE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${channel.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${channel.guild.id}_${user.id}_channeldelete`)
    let limit = db.get(`channeldelete_${channel.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${channel.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    let punish = db.get(`punish_${channel.guild.id}`)
    if(person > limit - 1) {
      if (punish === "ban") {
        channel.guild.members.ban(user.id).then(hahsh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de channel")
          .addField("Punition", punish)
          .addField("Bannie", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de channel")
          .addField("Punition", punish)
          .addField("Bannie", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        channel.guild.members.cache.get(user.id).kick().then(gsy => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de canal")
          .addField("Punition", punish)
          .addField("kick", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de channel")
          .addField("Punition", punish)
          .addField("kick", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        channel.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            channel.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(lolxd => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites de suppression de channel")
          .addField("Punition", punish)
          .addField("demoted", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "EliteProtec | Anti-Mode Protection de vos serveur")
          .addField("Punition", punish)
          .addField("demoted", "Non")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${channel.guild.id}_${user.id}_channeldelete`, 1)
       let pog = db.get(`${channel.guild.id}_${user.id}_channeldelete`)
       let bruh = db.get(`channeldelete_${channel.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(channel.guild.name + " EliteProtec | Anti-Mode Protection de vos serveur", channel.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Suppression de channel...")
          .addField("Punition", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
})

client.on("guildMemberRemove", async member => {
  const log1 = await member.guild.fetchAuditLogs().then(audit => audit.entries.first())
  if (log1.action === "MEMBER_KICK") {
    const log = await member.guild
      .fetchAuditLogs({
        type: "MEMBER_KICK"
        })
        .then(audit => audit.entries.first());
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${member.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${member.guild.id}_${user.id}_kicklimit`)
    let limit = db.get(`kicklimit_${member.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${member.guild.id}`)
    let punish = db.get(`punish_${member.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    if(person > limit - 1) {
      if (punish === "ban") {
        member.guild.members.ban(user.id).then(lolxdbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites des kicks")
          .addField("Punition", punish)
          .addField("Bannie", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid*")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites des kicks")
          .addField("Punition", punish)
          .addField("Bannie", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        member.guild.members.cache.get(user.id).kick().then(ehbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites des kicks")
          .addField("Punition", punish)
          .addField("kick", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites des kickd")
          .addField("Punition", punish)
          .addField("kick", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        member.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            member.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(lolbutbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites du kicks")
          .addField("Punition", punish)
          .addField("demoted", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | Briser les limites de kick")
          .addField("Punition", punish)
          .addField("demoted", "Non")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${member.guild.id}_${user.id}_kicklimit`, 1)
       let pog = db.get(`${member.guild.id}_${user.id}_kicklimit`)
       let bruh = db.get(`kicklimit_${member.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "kick aux membres...")
          .addField("Punition", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
  }
})

client.on("guildBanAdd", async (guild, userr) => {
  let member = guild.members.cache.get(userr.id)
    const log = await member.guild
      .fetchAuditLogs({
        type: "MEMBER_BAN"
        })
        .then(audit => audit.entries.first());
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = db.get(`whitelist_${member.guild.id}`)
    if(whitelist && whitelist.find(x => x.user === user.id)) {
    return;
    }
    let person = db.get(`${member.guild.id}_${user.id}_banlimit`)
    let limit = db.get(`banlimit_${member.guild.id}`)
    if (limit === null) {
      return;
    }
    let logsID = db.get(`logs_${member.guild.id}`)
    let logs = client.channels.cache.get(logsID)
    let punish = db.get(`punish_${member.guild.id}`)
    if(person > limit - 1) {
      if (punish === "ban") {
        member.guild.members.ban(user.id).then(lolxdbruh => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites d'interdiction")
          .addField("Punition", punish)
          .addField("Bannie", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites d'interdiction")
          .addField("Punition", punish)
          .addField("Bannie", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "kick") {
        member.guild.members.cache.get(user.id).kick().then(lolxdok => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites d'interdiction")
          .addField("Punition", punish)
          .addField("kick", "Oui")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites d'interdiction")
          .addField("Punition", punish)
          .addField("kick", "Non")
          .setColor("#FF0000")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      } else if (punish === "demote") {
        member.guild.members.cache.get(user.id).roles.cache.forEach(r => {
          if (r.name !== "@everyone") {
            member.guild.members.cache.get(user.id).roles.remove(r.id)
          }
        }).then(ok => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | briser les limites d'interdiction")
          .addField("Punition", punish)
          .addField("demoted", "Ouï")
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
          }
        }).catch(err => {
          let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid*")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "essayé de raid | Briser les limites d'interdiction")
          .addField("Punition", punish)
          .addField("demoted", "Non")
          if (logs) {
            logs.send({ embed: embed })
          }
        })
      }
    } else {
      db.add(`${member.guild.id}_${user.id}_banlimit`, 1)
       let pog = db.get(`${member.guild.id}_${user.id}_banlimit`)
       let bruh = db.get(`banlimit_${member.guild.id}`)
       let embed = new Discord.MessageEmbed()
          .setTitle("**EliteProtect Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name + "EliteProtec | Anti-Mode Protection de vos serveur", member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "bannir les membres...")
          .addField("punition", punish)
          .addField("Times", `${pog || 0}/${bruh || 0}`)
          .setColor("GREEN")
          if (logs) {
            logs.send({ embed: embed })
    }
    }
})




client.on('guildMemberRemove', async member => {
  db.delete(`ip_${member.guild.id}_${member.user.id}`);
	db.delete(`verified_${member.guild.id}_${member.user.id}`);
	
	let user = member.user
    let stuff = [`${member.guild.id}_${user.id}_rolecreate`, `${member.guild.id}_${user.id}_roledelete`, `${member.guild.id}_${user.id}_channelcreate`, `${member.guild.id}_${user.id}_channeldelete`, `${member.guild.id}_${user.id}_banlimit`, `${member.guild.id}_${user.id}_kicklimit`]
    stuff.forEach(bruh => db.delete(bruh))
});

client.login(token).catch(err => {
	console.log('[ERROR]: Invalid Token Provided');
});
dashboard(client);
