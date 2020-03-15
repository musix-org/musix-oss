module.exports = async function (client) {
    if (!client.guild.find('489111553321336832')) return;
    try {
        await client.channels.fetch(client.config.secondary_test_channel)
            .then(x => x.join());
    } catch (error) {
        client.debug_channel.send(client.messages.errorDetected + error);
    }
};