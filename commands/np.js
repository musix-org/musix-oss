module.exports = {
	name: 'np',
	description: 'Now playing command.',
	cooldown: 5,
	async execute(message, args, client, RichEmbed) {
		const ytdl = require('ytdl-core')
		const serverQueue = client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
		let songtime = (data.length_seconds * 1000).toFixed(0);
		let completed = (serverQueue.connection.dispatcher.time).toFixed(0);
		let barlength = 30;
		let completedpercent = ((completed / songtime) * barlength).toFixed(0);
		let array = []; for (let i = 0; i < completedpercent - 1; i++) { array.push('⎯'); } array.push('⭗'); for (let i = 0; i < barlength - completedpercent - 1; i++) { array.push('⎯'); }
		const totallength = Math.floor(data.length_seconds / 60) + ':' + (data.length_seconds - (Math.floor(data.length_seconds / 60) * 60))
		const timeins = serverQueue.connection.dispatcher.time / 1000
		const timepassed = Math.floor(timeins / 60) + ':' + Math.round(timeins - (Math.floor(timeins / 60) * 60))
		const embed = new RichEmbed()
			.setTitle("__Now playing__")
			.setDescription(`🎶**Now playing:** ${serverQueue.songs[0].title}\n${array.join('')} | \`${timepassed} / ${totallength}\``)
			.setColor("#b50002")
		return message.channel.send(embed);
	}
};
