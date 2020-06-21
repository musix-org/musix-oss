module.exports = function (client, connection) {
    connection.on("authenticated", () => {
        if (client.config.devMode) console.log("Voice connection initiated.");
    }).on("debug", (message) => {
        if (client.config.devMode) console.log(message);
    }).on("disconnect", () => {
        if (client.config.devMode) console.log("Voice connection disconnected.");
    }).on("error", (error) => {
        console.log(error);
    }).on("failed", (error) => {
        if (client.config.devMode) console.log(error);
    }).on("newSession", () => {
        if (client.config.devMode) console.log("New voice session id received!");
    }).on("ready", () => {
        if (client.config.devMode) console.log("Voice connection ready.");
    }).on("reconnecting", () => {
        if (client.config.devMode) console.log("Voice connection reconnecting.");
    }).on("warn", (warning) => {
        console.log(`Voice connection warning: ${warning}`);
    })
}