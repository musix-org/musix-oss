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
		const page = 1;
		let queuesongs = serverQueue.songs.slice((page - 1) * 20 + 1, page * 20 + 1);
		let queuemessage = `${queuesongs.map(song => `**#** ${song.title}`).join('\n')}`
		const hashs = queuemessage.split('**#**').length;
		for (let i = 0; i < hashs; i++) {
			queuemessage = queuemessage.replace('**#**', `**${i + 1}**`);
		}
		let message;
		message = client.messages.queueDesc.replace("%SONG%", serverQueue.songs[0].title);
		const embed = new Discord.MessageEmbed()
			.setTitle(client.messages.queueTitle)
			.setDescription(`${message}\n${queuemessage}`)
			.setFooter(`${serverQueue.songs.size - 20} ${client.messages.queueFooter}`)
			.setColor(client.config.embedColor)
		/*if (serverQueue.songs.size > 20) {
			embed.setFooter(`${serverQueue.songs.size - 20} ${client.messages.queueFooter}`)
		}*/
		return msg.channel.send(embed);
	}
};
