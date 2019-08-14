module.exports = {
    name: 'bug',
    description: 'Report a bug',
    cooldown: 5,
    async execute(msg, args, client, RichEmbed) {
        const embed = new RichEmbed()
            .setTitle(`Found a bug with ${client.user.username}?\nDM the core developer:`)
            .setDescription(`Matte#5254\nOr join the support server: https://discord.gg/rvHuJtB`)
            .setColor('#b50002');
        msg.channel.send(embed);
    },
};