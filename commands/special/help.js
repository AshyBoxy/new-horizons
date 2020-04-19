const { MessageEmbed } = require("discord.js");

exports.run = (bot, msg, args, prefix, guildConfig) => {
    let input = args ? args.join(" ").toLowerCase() : undefined;
    let cmd = bot.commands.get(input) || bot.commands.get(bot.aliases.get(input)),
        cmdModule = bot.modules[bot.modules.findIndex((x) => x.name.toLowerCase() == input)];

    let embed = new MessageEmbed()
        .setColor(msg.guild ? msg.guild.me.displayColor : 0x66cc00);

    if (cmdModule) {
        let cmdArr = bot.commands.array();

        for (let i = 0; i < cmdArr.length; i++) {
            if (cmdArr[i].module == cmdModule) embed.addField(cmdArr[i].name, cmdArr[i].info, true);
        }

        embed.setTitle(cmdModule.name)
            .setFooter(`Use '${prefix}help <command>' for more info on that command`);
    } else if (cmd) {
        embed.setTitle(`${msg.guild ? msg.guild.me.displayName : bot.user.username} Help Menu`)
            .setDescription(cmd.name)
            .addField("Info", cmd.info ? cmd.info : "No information available", true)
            .addField("Usage", cmd.usage ? cmd.usage : "No usage examples available", true);
        if (cmd.aliases) embed.addField("Aliases", cmd.aliases.join(", "), true);
    } else if (!args[0]) {
        embed.setTitle(`${msg.guild ? msg.guild.me.displayName : bot.user.username} Help Menu`)
            .setDescription("Modules")
            .setFooter(`Use '${prefix}help <module>' for more info on that module`);

        for (let i = 0; i < bot.modules.length; i++) {
            embed.addField(bot.modules[i].name, bot.modules[i].description, true);
        }
    } else {
        embed.setTitle(`Command or Module "${args[0]}" could not be found!`);
    }

    msg.channel.send(embed).catch(() => msg.channel.send("I need the attach files permission in this channel to use this command!")).catch(() => { });;
    return 0;
}

exports.name = "Help";
exports.info = "Help command";
exports.usage = "help [module|command]";
exports.aliases = ["h"];
