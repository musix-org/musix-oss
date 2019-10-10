module.exports = {
    name: 'bug',
    description: 'Report a bug',
    cooldown: 5,
    async execute(message, args, client, Discord, prefix) {
        const embed = new Discord.RichEmbed()
            .setTitle(`Found a bug with ${client.user.username}?\nDM the core developer:`)
            .setDescription(`Matte#0002\nOr join the support server: https://discord.gg/rvHuJtB`)
            .setColor('#b50002');
        message.channel.send(embed);
    },
};