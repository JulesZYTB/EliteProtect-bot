module.exports = {
	name: 'verify',
	run: async (client, message, args, db) => {
       if (db.get(`warningchannel_${message.guild.id}`) === null) return message.channel.send("Vous devez configurer d'abord le système de Captcha soit pas le dashboard : http://game01.teo-bot.fr:25572/ ou pas la commande !config ( fait !help config pour voir les détails de la commande !) le salon des warning");
        
        if (db.get(`logs_${message.guild.id}`) === null) return message.channel.send("Vous devez configurer d'abord le système de Captcha soit pas le dashboard : http://game01.teo-bot.fr:25572/ ou pas la commande !config ( fait !help config pour voir les détails de la commande !) le salon des logs");
        
        if (db.get(`role_${message.guild.id}`) === null) return message.channel.send("Vous devez configurer d'abord le système de Captcha soit pas le dashboard : http://game01.teo-bot.fr:25572/ ou pas la commande !config ( fait !help config pour voir les détails de la commande !) le role ");
        
		let verified = db.get(`verified_${message.guild.id}_${message.author.id}`);
        
        
        
        
		if (!verified) client.emit('guildMemberAdd', message.member);
		if (verified) message.channel.send(':x: | **Vous êtes déjà vérifié!**');
	}
};
