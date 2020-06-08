module.exports = async function (client) {
    const request = require("request");

    const refresh_token = client.config.spotify_refresh_token;
    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            Authorization: "Basic " +
                new Buffer(client.config.spotify_client_id + ":" + client.config.spotify_client_secret).toString("base64"),
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        },
        json: true,
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            client.config.spotify_access_key = body.access_token
        } else {
            console.log("An error occured!")
        }
    });
};