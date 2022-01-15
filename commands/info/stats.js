
const Discord = require('discord.js');


   const { loadavg, cpus, totalmem } = require('os');

     const prettyMilliseconds = require('pretty-ms');
const version = "2.5.9"

    


module.exports = {
	name: 'stats',
    run: async (client, message, args) => {
        let cpuCores = cpus().length;

        const e = new Discord.MessageEmbed()

        .setTitle("Informations sur le bot :")

        .setThumbnail(client.user.displayAvatarURL())

        .setFooter("Version " + client.version)

        .setTimestamp(Date())

        .setColor(client.color)

        .addField("**__:bookmark_tabs: Infos générales :__**", `> **:crown: Créateurs :** £ Jules-Z#1778\n**>  :calendar: Date de création :** 11/11/2021\n**>  :minidisc: Version :** 0.0.2`)

        .addField("**__:gear: Infos techniques :__**", `> **:floppy_disk: Bibliothèque :** Discord.JS V12\n > **:bar_chart: Utilisation du processeur :** ${(loadavg()[0]/cpuCores).toFixed(2)}% / 100% \n > **:bar_chart: Uptime :** ${prettyMilliseconds(client.uptime, {compact: true})}\n > **:bar_chart: Latence :** ${Math.sqrt(((new Date() - message.createdTimestamp)/(5*2))**2)} ms \n > **:bar_chart: Utilisation de la RAM :** ${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB`)

        .addField("**__:link: Liens__**", "[Serveur Support](https://discord.gg/9aexrmpRAA)")
        await message.channel.send(e)
    },
};
