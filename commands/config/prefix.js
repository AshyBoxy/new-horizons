const { readFileSync, writeFileSync } = require("fs");

exports.run = (bot, msg, args) => {
    let configData = JSON.parse(readFileSync(`${dir}/data/stored/guildConfig.json`));

    if (!args[0]) return 1;
    if (!configData[msg.guild.id]) {
        let defaultConfig = JSON.parse(readFileSync(`${dir}/data/defaultConfig.json`));
        configData[msg.guild.id] = defaultConfig;
        writeFileSync(`${dir}/data/stored/guildConfig.json`, JSON.stringify(configData));
    } else if (!configData[msg.guild.id].prefix) {
        let defaultConfig = JSON.parse(readFileSync(`${dir}/data/defaultConfig.json`));
        configData[msg.guild.id].prefix = defaultConfig.prefix;
        writeFileSync(`${dir}/data/stored/guildConfig.json`, JSON.stringify(configData));
    }
    configData[msg.guild.id].prefix = args[0].toLowerCase();
    writeFileSync(`${dir}/data/stored/guildConfig.json`, JSON.stringify(configData));
    msg.channel.send(`Set server prefix to ${args[0]}`);
};

exports.name = "Prefix";
exports.info = "Sets the guild's prefix";
exports.usage = "prefix <prefix>";
exports.guildOnly = true;

exports.permission = [
    "MANAGE_GUILD"
];
