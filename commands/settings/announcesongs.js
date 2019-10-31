module.exports = {
    name: 'announcesongs',
    async execute(message, args, client, Discord, prefix) {
        if (client.global.db.guilds[message.guild.id].startPlaying) {
            client.global.db.guilds[message.guild.id].startPlaying = false;
            return message.channel.send(':white_check_mark: announcesongs now set to `false`!');
        } else {
            client.global.db.guilds[message.guild.id].startPlaying = true;
            return message.channel.send(':white_check_mark: announcesongs now set to `true`!');
        }
    }
};