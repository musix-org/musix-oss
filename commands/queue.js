module.exports = {
	name: 'queue',
	alias: 'q',
	usage: '<page(opt)>',
	description: 'See the queue.',
	onlyDev: false,
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, prefix) {
		const serverQueue = client.queue.get(msg.guild.id);
		if (!serverQueue) return msg.channel.send(client.messages.noServerQueue);
		if (args[1]) {
			if (isNaN(args[1])) return msg.channel.send(client.messages.validNumber);
		}
		let page = parseInt(args[1]);
		if (!page) page = 1;
		let pagetext = client.messages.queuePages;
		if (page === 1) pagetext = client.messages.queueFirstPage;
		let queuesongs = serverQueue.songs.slice((page - 1) * 20 + 1, page * 20 + 1);
		let queuemessage = `${queuesongs.map(song => `**#** ${song.title}`).join('\n')}`
		const hashs = queuemessage.split('**#**').length;
		for (let i = 0; i < hashs; i++) {
			queuemessage = queuemessage.replace('**#**', `**${i + 1}**`);
		}
		client.messages.queueDesc = client.messages.queueDesc.replace("%SONG%", song.title);
		if (!serverQueue.looping) {
			const embed = new Discord.MessageEmbed()
				.setTitle(client.messages.queueTitle)
				.setDescription(`${client.messages.queueDesc}\n${pagetext}\n${queuemessage}`)
				.setColor(client.config.embedColor)
			return msg.channel.send(embed);
		} else {
			const embed = new Discord.MessageEmbed()
				.setTitle(client.messages.queueTitle)
				.setDescription(`${client.messages.queueDesc}\n${pagetext}\n${queuemessage}`)
				.setFooter('<:repeat1:674685561377914892> Currently looping the queue!')
				.setColor(client.config.embedColor)
			return msg.channel.send(embed);
		}
	}
};
