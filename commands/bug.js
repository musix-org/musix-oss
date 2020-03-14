module.exports = {
    name: 'bug',
    alias: 'none',
    usage: '',
    description: 'Report a bug',
    onlyDev: false,
    permission: 'none',
    category: 'info',
    async execute(msg, args, client, Discord, prefix, command) {
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.bugTitle)
            .setDescription(client.messages.bugDesc)
            .setColor(client.config.embedColor);
        msg.channel.send(embed);
    },
};