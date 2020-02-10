module.exports = {
	name: 'queue',
	alias: 'q',
	usage: 'queue <page(opt)>',
	description: 'See the queue.',
	onlyDev: false,
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, prefix) {
		const serverQueue = client.queue.get(msg.guild.id);
		if (!serverQueue) return msg.channel.send('<:redx:674263474704220182> There is nothing playing.');
		if (args[1]) {
			if (isNaN(args[1])) return msg.channel.send('<:redx:674263474704220182> I\'m sorry, But you need to enter a valid __number__.');
		}
		let page = parseInt(args[1]);
		if (!page) page = 1;
		let pagetext = `:page_facing_up: Page: ${page} :page_facing_up:`
		if (page === 1) pagetext = ':arrow_down: Next in queue :arrow_down:'
		let queuesongs = serverQueue.songs.slice((page - 1) * 20 + 1, page * 20 + 1);
		let queuemessage = `${queuesongs.map(song => `**#** ${song.title}`).join('\n')}`
		const hashs = queuemessage.split('**#**').length;
		for (let i = 0; i < hashs; i++) {
			queuemessage = queuemessage.replace('**#**', `**${i + 1}**`);
		}
		if (!serverQueue.looping) {
			const embed = new Discord.MessageEmbed()
				.setTitle("__Song queue__")
				.setDescription(`**Now playing:** ${serverQueue.songs[0].title}<a:aNotes:674602408105476106>\n${pagetext}\n${queuemessage}`)
				.setColor(client.config.embedColor)
			return msg.channel.send(embed);
		} else {
			const embed = new Discord.MessageEmbed()
				.setTitle("__Song queue__")
				.setDescription(`**Now playing:** ${serverQueue.songs[0].title}<a:aNotes:674602408105476106>\n${pagetext}\n${queuemessage}`)
				.setFooter('<:repeat1:674685561377914892> Currently looping the queue!')
				.setColor(client.config.embedColor)
			return msg.channel.send(embed);
		}
	}
};
