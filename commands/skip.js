module.exports = {
	name: 'skip',
	description: 'Skip command.',
	alias: 's',
	cooldown: 5,
	onlyDev: false,
	execute(message, args, client, Discord, prefix) {
		const { voiceChannel } = message.member;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing that I could skip for you.');
		if (!serverQueue.playing) return message.channel.send(':x: There is nothing playing that I could skip for you.');
		if (message.author.id !== client.config.devId) {
			if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to skip the song!');
			if (client.global.db.guilds[message.guild.id].permissions === true) {
				if (!message.member.roles.has(client.global.db.guilds[message.guild.id].djrole) && !permissions.has('MANAGE_MESSAGES')) {
					return vote(serverQueue, message, client);
				} else {
					return skipSong(serverQueue, message);
				}
			} else {
				return vote(serverQueue, message, client);
			}
		} else {
			return skipSong(serverQueue, message);
		}
	}
};
function skipSong(serverQueue, message) {
	message.channel.send(':fast_forward: Skipped the song!');
	serverQueue.connection.dispatcher.end('skipped');
};
function vote(serverQueue, message) {
	serverQueue.votesNeeded = Math.floor(message.guild.voiceConnection.channel.members.size / 2);
	serverQueue.votesNeeded.toFixed();
	if (message.guild.voiceConnection.channel.members.size > 2) {
		if (serverQueue.voters.includes(message.member.id)) return message.channel.send(':x: You have already voted to skip!');
		serverQueue.votes++;
		serverQueue.voters.push(message.member.id);
		if (serverQueue.votes >= serverQueue.votesNeeded) {
			serverQueue.voters = [];
			serverQueue.votes = 0;
			serverQueue.votesNeeded = null;
			return skipSong(serverQueue, message);
		} else return message.channel.send(`:x: Not enough votes! ${serverQueue.votes} / ${serverQueue.votesNeeded}!`);
	} else {
		return skipSong(serverQueue, message);
	}
};
