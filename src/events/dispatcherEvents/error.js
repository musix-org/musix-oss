module.exports = async function (client, error, guild) {
    const queue = client.queue.get(guild.id);
    console.log(error);
    /*if (error = "Error: input stream: This video contains content from WMG, who has blocked it on copyright grounds.") {
        queue.endReason = "skip";
        queue.connection.dispatcher.end();
        return queue.textChannel.send(client.messages.songBlockedWMG);
    }*/
    queue.voiceChannel.leave();
    client.queue.delete(guild.id);
    return queue.textChannel.send(client.messages.errorDispatcher + `\`${error}\``);
};