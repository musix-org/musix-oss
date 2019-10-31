module.exports = {
    name: 'list',
    async execute(message, args, client, Discord, prefix) {
        if (args[2]) {
            if (isNaN(args[2])) return msg.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.');
        }
        let page = parseInt(args[2]);
        if (!page) page = 1;
        let pagetext = `:page_facing_up: Page: ${page} :page_facing_up:`
        let queuesongs = client.global.db.playlists[message.guild.id].songs.slice((page - 1) * 20, page * 20);
        let queuemessage = `${queuesongs.map(song => `**#** ${song.title}`).join('\n')}`
        const hashs = queuemessage.split('**#**').length;
        for (let i = 0; i < hashs; i++) {
            queuemessage = queuemessage.replace('**#**', `**${i + 1}**`);
        }
        const embed = new Discord.RichEmbed()
            .setTitle("__playlist queue__")
            .setDescription(`${pagetext}\n${queuemessage}`)
            .setColor("#b50002")
        return message.channel.send(embed);
    }
};