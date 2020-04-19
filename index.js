const { Client, MessageEmbed, Collection } = require("discord.js"),
    { readdirSync, readFileSync, writeFileSync } = require("fs"),
    utils = require("./utilities/utils"),
    discordUtils = require("./utilities/discord");

const bot = new Client();

bot.modules = require("./commands/modules");
bot.config = require("./config");

global.dir = __dirname;

process.on("SIGINT", async () => {
    console.log("Shutting Down...");
    bot.destroy();
    process.exit();
});

bot.commands = new Collection();
bot.aliases = new Collection();

for (let i = 0; i < bot.modules.length; i++) {
    let commandFiles = readdirSync(`./commands/${bot.modules[i].path}`).filter(x => x.endsWith(".js"));

    for (let x = 0; x < commandFiles.length; x++) {
        let cmd = require(`./commands/${bot.modules[i].path}/${commandFiles[x]}`);
        if (!cmd) continue;
        if (!cmd.run || !cmd.name) continue;
        cmd.module = bot.modules[i];
        bot.commands.set(cmd.name.toLowerCase(), cmd);
        if (cmd.aliases) {
            for (let y = 0; y < cmd.aliases.length; y++) {
                bot.aliases.set(cmd.aliases[y], cmd.name.toLowerCase());
            }
        }
    }
}

bot.on("ready", () => {
    console.log(`Online as ${bot.user.tag}!`);
    bot.user.setPresence({
        "status": "online",
        "activity": {
            "name": "Animal Crossing: New Horizons",
            "type": "PLAYING"
        }
    });
});

bot.on("message", async (msg) => {
    if (msg.author.bot) return;


    let prefix = bot.config.prefix,
        configData = JSON.parse(readFileSync("data/stored/guildConfig.json"));
    if (msg.channel.type == "text") {
        if (!configData[msg.guild.id]) {
            let defaultConfig = JSON.parse(readFileSync("data/defaultConfig.json"));
            configData[msg.guild.id] = defaultConfig;
            writeFileSync("data/stored/guildConfig.json", JSON.stringify(configData));
        } else if (!configData[msg.guild.id].prefix) {
            let defaultConfig = JSON.parse(readFileSync("data/defaultConfig.json"));
            configData[msg.guild.id].prefix = defaultConfig.prefix;
            writeFileSync("data/stored/guildConfig.json", JSON.stringify(configData));
        }
        prefix = configData[msg.guild.id].prefix;
    }

    let msgArr = msg.content.split(" "),
        cmd = msgArr[0].toLowerCase(),
        args = msgArr.slice(1);

    if (!cmd) return;

    if (new RegExp(`^<@!?${bot.user.id}>$`).test(cmd)) {
        if (!msgArr[1]) {
            msg.channel.send("Looking for suggestions on what to put here!");
            return;
        };
        cmd = msgArr[1].toLowerCase();
        args = msgArr.slice(2);
        prefix = "";
    }

    if (!cmd.startsWith(prefix)) return;

    let command;

    if (bot.commands.get(cmd.slice(prefix.length))) command = bot.commands.get(cmd.slice(prefix.length));
    else if (bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))) command = bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));

    if (command) return discordUtils.runCommand(bot, msg, args, command, prefix.length == 0 ? msg.guild ? configData[msg.guild.id].prefix : bot.config.prefix : prefix, configData);
});

bot.login(bot.config.token);
