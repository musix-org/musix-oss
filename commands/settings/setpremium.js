module.exports = {
    name: 'setpremium',
    async execute(message, args, client, prefix) {
        //if (message.author.id !== client.config.devId) return;
        if (args[2]) {
            const guild = client.guilds.get(args[2]);
            if (!client.global.db.guilds[guild.id].premium) {
                client.global.db.playlists[guild.id] = {
                    songs: [],
                    firstSong: undefined,
                    saved: false,
                };
                client.global.db.guilds[guild.id].premium = true;
                message.channel.send(`:white_check_mark: Guild ${guild.name} | ${guild.id} is now premium! :tada:`)
            } else {
                client.global.db.guilds[guild.id].premium = false;
                message.channel.send(`:white_check_mark: Guild ${guild.name} | ${guild.id} is no longer premium!`)
            }
        } else {
            if (!client.global.db.guilds[message.guild.id].premium) {
                client.global.db.playlists[message.guild.id] = {
                    songs: [],
                    firstSong: undefined,
                    saved: false,
                };
                client.global.db.guilds[message.guild.id].premium = true;
                message.channel.send(':white_check_mark: This guild is now premium! :tada:')
            } else {
                client.global.db.guilds[message.guild.id].premium = false;
                message.channel.send(":white_check_mark: This guild is no longer premium!")
            }
        }
    }
};
