module.exports = {
	name: 'queue',
	description: 'Queue command.',
	cooldown: 5,
	async execute(message, args, client, RichEmbed) {
		const serverQueue = client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		let page = parseInt(args[1]);
		if (!page) page = 1;
		let queuesongs = serverQueue.songs.slice((page - 1) * 10 + 1, page * 20 + 1);
		let queuemessage = `${queuesongs.map(song => `**#** ${song.title}`).join('\n')}`
		if (queuemessage.length >= 1972) {
			let finalQueuemessage = queuemessage.slice(0, 1972).split('**#**').slice(0, -1).join('**#**');
			const overflowSongsAmount = queuemessage.replace(finalQueuemessage, '').split('**#**').length;
			finalQueuemessage += `\nI could not display all the songs at once. ${overflowSongsAmount} songs were not displayed here.`;
			queuemessage = finalQueuemessage;
		}
		const hashs = queuemessage.split('**#**').length;
		for (let i = 0; i < hashs; i++) {
			queuemessage = queuemessage.replace('**#**', `**${i + 1}**`);

		}
		const embed = new RichEmbed()
			.setTitle("__Song queue__")
			.setDescription(queuemessage)
			.setFooter(`🎶 **Now playing:** ${serverQueue.songs[0].title}`)
			.setColor("#b50002")
		return message.channel.send(embed);
	}
};
