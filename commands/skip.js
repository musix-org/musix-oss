module.exports = {
	name: 'skip',
	description: 'Skip command.',
	alias: 'skip',
	cooldown: 5,
	onlyDev: false,
	execute(message, args, client, Discord, prefix) {
		const { voiceChannel } = message.member;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing that I could skip for you.');
		if (message.author.id !== client.config.dev) {
			if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to skip the song!');
			if (client.global.db.guilds[message.guild.id].permissions === true) {
				if (client.global.db.guilds[message.guild.id].dj) {
					if (!message.member.roles.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to skip songs!');
				} else if (!permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to skip songs!');
			}
		}
		message.channel.send(':fast_forward: Skipped the song!');
		serverQueue.connection.dispatcher.end('skipped');
	}
};
