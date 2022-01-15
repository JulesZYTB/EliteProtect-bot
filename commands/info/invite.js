
const Discord = require('discord.js');

module.exports = {
	name: 'invite',
    run: async (client, message, args) => {
	
        const { oneLine } = require('common-tags');
        
        const embed = new Discord.MessageEmbed()

      .setTitle('Je serais ravi d\'être sur ton serveur !')

      

      .setDescription(oneLine`

        [Ajouter EliteProtect](https://discordapp.com/oauth2/authorize?client_id=874296955600252939&scope=bot&permissions=8) pour m'inviter sur ton serveur !`)

      .setFooter(`EliteProtect, Protége votre serveur à 98%!`)

      .setTimestamp()

      .setColor("#2f3136");

    message.channel.send(embed);
                                              },
}; 