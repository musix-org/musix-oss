module.exports = {
    name: 'nowplaying',
    alias: 'np',
    usage: '',
    description: 'See the currently playing song position and length.',
    onlyDev: false,
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, command) {
        const getThumb = require('video-thumbnail-url');
        const ytdl = require('ytdl-core');
        const queue = client.queue.get(msg.guild.id);
        if (!queue) return msg.channel.send(client.messages.noServerQueue);
        let data = await Promise.resolve(ytdl.getInfo(queue.songs[0].url));
        let songtime = (data.length_seconds * 1000).toFixed(0);
        queue.time = queue.connection.dispatcher.streamTime;
        let completed = (queue.time.toFixed(0));
        let barlength = 30;
        let completedpercent = ((completed / songtime) * barlength).toFixed(0);
        let array = []; for (let i = 0; i < completedpercent - 1; i++) { array.push('⎯'); } array.push('⭗'); for (let i = 0; i < barlength - completedpercent - 1; i++) { array.push('⎯'); }
        const thumbnail = getThumb(queue.songs[0].url);
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.nowPlaying)
            .setDescription(`${client.messages.nowPlayingDesc} ${queue.songs[0].title}\n${array.join('')} | \`${client.funcs.msToTime(completed, "hh:mm:ss")} / ${client.funcs.msToTime(songtime, "hh:mm:ss")}\``)
            .setFooter(`Queued by ${queue.songs[0].author.tag}`)
            .setURL(queue.songs[0].url)
            .setThumbnail(thumbnail._rejectionHandler0)
            .setColor(client.config.embedColor)
        return msg.channel.send(embed);
    }
};

