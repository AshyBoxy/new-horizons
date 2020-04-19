exports.run = (bot, msg, args) => {
    msg.channel.send("Invite me here: <https://discordapp.com/api/oauth2/authorize?client_id=698118774313713696&permissions=379968&scope=bot>").catch(() => { });
}

exports.name = "Invite";
exports.info = "Sends a link to invite the bot";
exports.usage = "invite";
