exports.run = (bot, msg, args) => {
    msg.channel.send(null, {
        "files": [
            "https://villagerdb.com/images/villagers/full/raymond.png"
        ]
    }).catch(() => msg.channel.send("I need to be able to send images in this channel for this command to work!")).catch(() => { });
}

exports.name = "Raymond";
exports.info = "Raymond";
exports.usage = "raymond";
