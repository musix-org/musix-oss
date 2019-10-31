module.exports = function (message, args, client, Discord, prefix, command) {
    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has('EMBED_LINKS')) return message.channel.send(':x: I cannot send embeds (Embed links), make sure I have the proper permissions!');
    try {
        command.execute(message, args, client, Discord, prefix);
    } catch (error) {
        message.reply(`:x: there was an error trying to execute that command! Please contact support with \`${prefix}bug\`!`);
        const embed = new Discord.RichEmbed()
            .setTitle(`Musix ${error.toString()}`)
            .setDescription(error.stack.replace(/at /g, '**at **'))
            .setColor('#b50002');
        client.fetchUser(client.config.devId).then(user => user.send(embed)).catch(console.error);
        client.channels.get(client.config.debug_channel).send(embed);
    }
};
