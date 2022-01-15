module.exports = {
	name: 'bypass',
	run: async (client, message, args, db) => {
		if (!message.channel.permissionsFor(message.author).has('MANAGE_GUILD'))
			return message.channel.send(
				":x: | **Vous n'êtes pas autorisé à utiliser cette commande !**"
			);
		let options = ['add', 'remove'];
		function check(opt) {
			return options.some(x => x === opt);
		}
		async function fetchUser(ID) {
			let user = await client.users.fetch(ID);
			return user;
		}
		async function checkUser(ID) {
			let user = await fetchUser(ID);
			if (!user) return false;
			else return true;
		}
		let option = args[0];
		let ID =
			args[1] || message.mentions.users.first()
				? message.mentions.users.first().id
				: null;
		if (!option)
			return message.channel.send(
				`:x: | **L'option doit être l'une des ${options.join(', ')}**`
			);
		if (!ID)
			return message.channel.send(
				`:x: | **L'ID/la mention est un argument obligatoire**`
			);
		if (!check(option.toLowerCase()))
			return message.channel.send(
				`:x: | **L'argument option doit être l'un des ${options.join(', ')}**`
			);
		switch (option.toLowerCase()) {
			case 'add':
				if (!checkUser(ID))
					return message.channel.send(`:x: | **L'utilisateur n'existe pas**`);
				else {
					let role = message.guild.roles.cache.get(
						db.get(`role_${message.guild.id}`)
					);
					if (role && message.guild.members.cache.get(ID)) {
						message.guild.members.cache
							.get(ID)
							.roles.add(role)
							.catch(err => {});
					}
					let user = await fetchUser(ID);
					let pog = db.get(`bypass_${message.guild.id}`) || [];
					db.push(`bypass_${message.guild.id}`, { id: user.id });
					let data = pog.find(x => x.id === ID);
					if (data)
						return message.channel.send(
							"**L'utilisateur est déjà sur la liste de contournement**"
						);
					return message.channel.send(
						`${user.tag} a été ajouté à la liste de contournement`
					);
				}
				break;
			case 'remove':
				if (!checkUser(ID))
					return message.channel.send(`:x: | **L'utilisateur n'existe pas**`);
				else {
					let role = message.guild.roles.cache.get(
						db.get(`role_${message.guild.id}`)
					);
					if (role && message.guild.members.cache.get(ID)) {
						message.guild.members.cache
							.get(ID)
							.roles.remove(role)
							.catch(err => {});
					}
					let user = await fetchUser(ID);
					let pog = db.get(`bypass_${message.guild.id}`) || [];
					if (pog) {
						let data = pog.find(x => x.id === ID);
						if (!data)
							return message.channel.send("**L'utilisateur n'ai pas dans la liste de contournement**");
						let index = pog.indexOf(data);
						delete pog[index];
						var filter = pog.filter(x => {
							return x != null && x != '';
						});
						db.set(`bypass_${message.guild.id}`, filter);
					}
					return message.channel.send(
						`${user.tag} a été supprimé de la liste de contournement`
					);
				}
				break;
		}
	}
};
