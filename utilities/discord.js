const discordUtils = () => { return "Discord Utils"; };

async function runCommand(bot, msg, args, command, prefix, guildConfig) {
    if (command.disabled) return msg.channel.send("This command is currently disabled!");
    if (command.guildOnly && !msg.guild) return msg.channel.send("This command can only be used in a server!");
    if (command.dmOnly && msg.channel.type != "dm") return msg.channel.send("This command can only be used in a DM!");
    if (command.permission) if (msg.channel.type != "dm") if (!checkPermission(command.permission, msg.member)) return msg.channel.send("You don't have the required permissions to use this command!");

    let cmdRun = await command.run(bot, msg, args, prefix, guildConfig);

    if (cmdRun == 1) return msg.channel.send(`Usage: ${prefix}${command.usage}`);
    else if (cmdRun == 2) return msg.channel.send(`There was an error processing that command! Please try again.`);
}

function checkPermission(permission, member) {
    if (!permission) return false;
    if (!member) return false;

    let hasPerm = member.hasPermission(permission);

    return hasPerm;
};

discordUtils.runCommand = runCommand;
discordUtils.checkPermission = checkPermission;

module.exports = discordUtils;
