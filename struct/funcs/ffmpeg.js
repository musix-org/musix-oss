module.exports = async function (client) {
    try {
        await client.channels.get(client.config.secondary_test_channel).join()
    } catch (error) {
        client.channels.get(client.config.debug_channel).send("Error detected: " + error);
    }
};