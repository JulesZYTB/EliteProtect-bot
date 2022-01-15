const Discord = require('discord.js');

module.exports = {
	name: 'help',
	run: async (client, message, args) => {

const embed = new Discord.MessageEmbed()
    .setColor(`RANDOM`)
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setTitle(`${client.user.username} v2.0`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`Voici la page de help ou vous pouvez trouvée tout commands est informations !`)
    .addFields(
      { name: `!help`, value: `Commands help montre tout les autre commande. [invité Moi]()`, inline: true},
      { name: `?invite`, value: `Invité le bot sur votre serveur [invite Moi]()`, inline: true},
      { name: `!antie-lien **[on/off]**`, value: ` activé ou désactiver le antie lien !. [invite Moi]()`, inline: true },
      { name: `!config-channelcreatelimit <nombres>`, value: ` Configurer la limite de création de channel .[invite Moi]()`, inline: true },
      { name: `!config-channeldeletelimit <nombres>`, value: `Configurer la limite de supression de channel . [invite Moi]()`, inline: true},
      { name: `!config-rolecreatelimit <nombres>`, value: `Configurer la limite de création de role . [invite Moi]()`, inline: true},
      { name: `!config-roledeletelimit <nombres>`, value: `Configurer la limite de supression de role . [invite Moi]()`, inline: true},
      { name: `!config-banlimit`, value: `Configurer la limite de bannissement. [invite Moi]()`, inline: true} ,
      { name: `!config-kicklimit`, value: `Configurer la limite de l'exclusion. [invite Moi]()`, inline: true},
      { name: `!config-punition **[ban/kick]**`, value: `Configurer la punition pour seul qui enfin la limite des créations, suppression ou bannissement/expulsion . [invite Moi]()`, inline: true},
      { name: `!config-show`, value: `Voir la configurations des limite du serveur . [invite Moi]()`, inline: true},
      { name: `!config **[logs/punishment/warningchannel/role/show]**`, value: ` Configurer le système de Captcha avec le dashboard et pour voir la configuration. [invite Moi]()`, inline: true},
      { name: `!bypass`, value: `Fair contourné le Captcha . [invite Moi]()`, inline: true},
      { name: `!verify`, value: `Passée la vérification si la première n'a pas était fait. [invite Moi]()`, inline: true},
      { name: `!clearuser`, value: ` Supprimé tout la configuration des limites. [invite Moi]()`, inline: true},
      { name: `!stats`, value: `Informations Des statistiques du bot . [invite Moi]()`, inline: true})
  
   
    message.channel.send(embed).catch(e => message.channel.send(`Je n'ai pas les permissions de embed ou de intégration de lien !`))
 }
     }
