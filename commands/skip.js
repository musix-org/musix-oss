module.exports = {
	name: 'skip',
	alias: 's',
	usage: 'skip',
	description: 'Skip the currently playing song.',
	onlyDev: false,
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const serverQueue = client.queue.get(msg.guild.id);
		const permissions = msg.channel.permissionsFor(msg.author);
		if (!serverQueue || !serverQueue.playing) return msg.channel.send('<:redx:674263474704220182> There is nothing playing!');
		if (msg.author.id !== client.config.devId) {
			if (msg.member.voice.channel !== serverQueue.voiceChannel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in the same voice channel as Musix!');
			if (client.global.db.guilds[msg.guild.id].permissions === true) {
				if (!msg.member.roles.has(client.global.db.guilds[msg.guild.id].djrole) && !permissions.has(command.permission)) {
					return vote(serverQueue, msg, client);
				} else {
					return skipSong(serverQueue, msg);
				}
			} else {
				return vote(serverQueue, msg, client);
			}
		} else {
			return skipSong(serverQueue, msg);
		}
	}
};
function skipSong(serverQueue, msg) {
	msg.channel.send('<:skip:674685614221688832> Skipped the song!');
	serverQueue.connection.dispatcher.end('skipped');
};
function vote(serverQueue, msg) {
	serverQueue.votesNeeded = Math.floor(serverQueue.voiceChannel.members.size / 2);
	serverQueue.votesNeeded.toFixed();
	if (serverQueue.voiceChannel.members.size > 2) {
		if (serverQueue.voters.includes(msg.member.id)) return msg.channel.send('<:redx:674263474704220182> You have already voted to skip!');
		serverQueue.votes++;
		serverQueue.voters.push(msg.member.id);
		if (serverQueue.votes >= serverQueue.votesNeeded) {
			serverQueue.voters = [];
			serverQueue.votes = 0;
			serverQueue.votesNeeded = null;
			return skipSong(serverQueue, msg);
		} else return msg.channel.send(`<:redx:674263474704220182> Not enough votes! ${serverQueue.votes} / ${serverQueue.votesNeeded}!`);
	} else {
		return skipSong(serverQueue, msg);
	}
};
