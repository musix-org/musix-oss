module.exports = {
    name: 'announcesongs',
    async execute(msg, args, client, Discord, prefix) {
        if (client.global.db.guilds[msg.guild.id].startPlaying) {
            client.global.db.guilds[msg.guild.id].startPlaying = false;
            return msg.channel.send('<:green_check_mark:674265384777416705> announcesongs now set to `false`!');
        } else {
            client.global.db.guilds[msg.guild.id].startPlaying = true;
            return msg.channel.send('<:green_check_mark:674265384777416705> announcesongs now set to `true`!');
        }
    }
};