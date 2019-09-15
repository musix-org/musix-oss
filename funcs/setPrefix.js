module.exports = async function (newPrefix, guildId) {
    await client.db.collection('guilds').doc(guildId).set({
        prefix: newPrefix,
    }, { merge: true });
    return 'success';
}