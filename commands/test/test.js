exports.run = (bot, msg, args) => {
    msg.channel.send("Test command");
};

exports.name = "Test";
exports.info = "Test command";
exports.usage = "test";
exports.aliases = ["t"];

exports.disabled = false;
exports.guildOnly = true;
exports.dmOnly = false;
exports.permission = [
    "MANAGE_GUILD"
];
