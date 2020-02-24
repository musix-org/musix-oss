module.exports = {
    name: 'nowplaying',
    alias: 'np',
    usage: '',
    description: 'See the currently playing song position and length.',
    onlyDev: false,
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, prefix) {
        const getThumb = require('video-thumbnail-url');
        const ytdl = require('ytdl-core');
        const serverQueue = client.queue.get(msg.guild.id);
        if (!serverQueue) return msg.channel.send('<:redx:674263474704220182> There is nothing playing.');
        if (!serverQueue.playing) return msg.channel.send('<:redx:674263474704220182> There is nothing playing.');
        let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
        let songtime = (data.length_seconds * 1000).toFixed(0);
        serverQueue.time = serverQueue.connection.dispatcher.streamTime;
        let completed = (serverQueue.time.toFixed(0));
        let barlength = 30;
        let completedpercent = ((completed / songtime) * barlength).toFixed(0);
        let array = []; for (let i = 0; i < completedpercent - 1; i++) { array.push('⎯'); } array.push('⭗'); for (let i = 0; i < barlength - completedpercent - 1; i++) { array.push('⎯'); }
        const thumbnail = getThumb(serverQueue.songs[0].url);
        const embed = new Discord.MessageEmbed()
            .setTitle("__Now playing__")
            .setDescription(`<a:aNotes:674602408105476106>**Now playing:** ${serverQueue.songs[0].title}\n${array.join('')} | \`${client.funcs.msToTime(completed, "hh:mm:ss")} / ${client.funcs.msToTime(songtime, "hh:mm:ss")}\``)
            .setFooter(`Queued by ${serverQueue.songs[0].author.tag}`)
            .setURL(serverQueue.songs[0].url)
            .setThumbnail(thumbnail._rejectionHandler0)
            .setColor(client.config.embedColor)
        return msg.channel.send(embed);
    }
};

