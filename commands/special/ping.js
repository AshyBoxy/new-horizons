exports.run = (bot, msg, args) => {
    msg.channel.send(`Pong! ${Math.floor(bot.ws.ping)}ms`);
}

exports.name = "Ping";
exports.info = "Displays websocket ping";
exports.usage = "ping";
exports.aliases = ["p", "pong"];

exports.disabled = false;
exports.guildOnly = false;
exports.dmOnly = false;
exports.permission = [];
