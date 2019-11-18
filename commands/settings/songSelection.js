module.exports = {
    name: 'songselection',
    async execute(message, args, client, Discord, prefix) {
        if (!client.global.db.guilds[message.guild.id].songSelection) {
            message.channel.send(':white_check_mark: Songselection now set to `true`!');
            client.global.db.guilds[message.guild.id].songSelection = true;
        } else {
            client.global.db.guilds[message.guild.id].songSelection = false;
            message.channel.send(':white_check_mark: Songselection now set to `false`');
        }
    }
};