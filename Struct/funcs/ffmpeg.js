module.exports = async function (client) {
    try {
        await client.channels.get('570531724002328577').join()
    } catch (error) {
        client.channels.get(client.config.debug_channel).send("Error detected: " + error);
    }
};