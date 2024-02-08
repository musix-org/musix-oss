const { Client, Collection } = require('discord.js');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

module.exports = class extends Client {
    constructor() {
        super({
            disableEveryone: true,
            disabledEvents: ['TYPING_START']
        });

        this.commands = new Collection();

        this.commandAliases = new Collection();

        this.playlistCmd = new Collection();

        this.settingCmd = new Collection();

        this.events = new Collection();

        this.queue = new Map();

        this.funcs = {};

        this.funcs.handleVideo = require('./funcs/handleVideo.js');
        this.funcs.play = require('./funcs/play.js');
        this.funcs.msToTime = require('./funcs/msToTime.js');
        this.funcs.dbget = require('./funcs/dbget.js');
        this.funcs.exe = require('./funcs/exe.js');
        this.funcs.ffmpeg = require('./funcs/ffmpeg.js');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        this.db = admin.firestore();

        this.global = {
            db: {
                guilds: {},
                playlists: {},
            },
        };

        this.db.FieldValue = require('firebase-admin').firestore.FieldValue;
    }
};
