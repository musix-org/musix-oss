module.exports = async function (client) {
    try {
        await client.channels.fetch(client.config.secondary_test_channel)
            .then(x => x.join());
    } catch (error) {
        client.channels.get(client.config.debug_channel).send("Error detected: " + error);
    }
};