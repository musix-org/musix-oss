module.exports = {
    name: 'Shuffle',
    description: 'Shuffle command.',
    alias: 'shuffle',
    cooldown: 5,
    onlyDev: false,
    execute(message, args, client, Discord, prefix) {
        const serverQueue = client.queue.get(message.guild.id);
        let currentIndex = serverQueue.songs.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = serverQueue.songs[currentIndex];
            serverQueue.songs[currentIndex] = serverQueue.songs[randomIndex];
            serverQueue.songs[randomIndex] = temporaryValue;
        }
    }
};