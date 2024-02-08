module.exports = function (client, dispatcher, queue, guild) {
    dispatcher.on("finish", () => {
            if (client.config.devMode) console.log("Dispatcher finish.");
            require("./finish").execute(client, guild);
        })
        .on("start", () => {
            if (client.config.devMode) console.log("Dispatcher start.");
            queue.endReason = null;
            dispatcher.player.streamingData.pausedTime = 0;
        })
        .on("error", (error) => {
            require("./error").execute(client, error, guild);
        }).on("debug", (info) => {
            if (client.config.devMode) console.log(info);
        })
}