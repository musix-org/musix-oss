module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {
        let change = false;
        const serverQueue = client.queue.get(newState.guild.id);
        if (!serverQueue) return;
        if (newState.member.id === client.user.id && oldState.member.id === client.user.id) {
            if (newState.member.voice.channel === null) {
                serverQueue.songs = [];
                serverQueue.looping = false;
                serverQueue.endReason = "manual disconnect";
                return client.queue.delete(newState.guild.id);
            }
            if (newState.member.voice.channel !== serverQueue.voiceChannel) {
                change = true;
                serverQueue.voiceChannel = newState.member.voice.channel;
                serverQueue.connection = newState.connection;
            }
        }
        if (oldState.channel === null) return;
        if (oldState.channel.members.size === 1 && oldState.channel === serverQueue.voiceChannel || change) {
            setTimeout(() => {
                if (!serverQueue) return;
                if (serverQueue.voiceChannel.members.size === 1) {
                    serverQueue.songs = [];
                    serverQueue.looping = false;
                    serverQueue.endReason = "Timeout";
                    serverQueue.connection.dispatcher.end();
                }
            }, 12000);
        }
    }
}
