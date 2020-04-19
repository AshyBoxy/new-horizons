const { MessageEmbed } = require("discord.js"),
    meant = require("meant"),
    utils = require("../../utilities/utils");

const villagers = require("../../data/villagers.json");

exports.run = (bot, msg, args) => {
    let name = args;
    if (!name || !name[0]) return 1;
    let nameHasSpace = false;
    let villager;

    for (let i = 0; i < Object.keys(villagers).length; i++) {
        let villagerData = villagers[Object.keys(villagers)[i]];

        if (villagerData.id.toLowerCase() == args[0].toLowerCase() || villagerData.name.toLowerCase() == args[0].toLowerCase()) {
            villager = villagerData;
            break;
        } else if (args[1]) if (villagerData.id.toLowerCase() == args[0].toLowerCase() + " " + args[1].toLowerCase()
            || villagerData.name.toLowerCase() == args[0].toLowerCase() + " " + args[1].toLowerCase()) {
            villager = villagerData;
            nameHasSpace = true;
            break;
        }
    }

    if (!villager) {
        let isArgs1Game = false;
        if (name[1]) isArgs1Game = utils.ac.testForGameName(name[1]);
        let mean = meant(isArgs1Game ? name[0] : name.join(" "), Object.keys(villagers))[0];
        msg.channel.send(`Villager "${utils.ac.testForGameName(args[1] ? args[1] : args[0]) ? args[0] : typeof name == "object" ? name.join(" ") : name}" not found.${mean ? ` Did you mean "${mean}"?` : ""}`);
        return;
    }
    let game = args.slice(nameHasSpace ? 2 : 1).join(" ").toLowerCase();
    if (game.startsWith("ac") && game.length > 2) game = game.slice(2);
    game = utils.ac.longToShortName(game);
    let gameName = game;
    game = villager.games[game] ? villager.games[game] : game;

    let latestGame = utils.ac.getLatestGame(villager);
    let embed = new MessageEmbed();

    embed.setColor(msg.guild ? msg.guild.me.displayColor : 0x00ADFF)
        .setTitle(`Data for ${villager.name}`)
        .addField("Species", utils.toTitleCase(villager.species), true)
        .addField("Gender", utils.toTitleCase(villager.gender), true)
        .addField("Birthday", utils.getMonthAndDateString(villager.birthday), true)
        .addField("Games", utils.ac.shortToLongName(Object.keys(villager.games)).join(", "), true)
        .setFooter(msg.guild ? msg.guild.me.displayName : bot.user.username, bot.user.displayAvatarURL({
            "format": "png",
            "size": 2048
        }))
        .setThumbnail(`https://villagerdb.com/images/villagers/full/${villager.id.toLowerCase()}.png`);

    if (!game) {
        embed.setTitle(`${utils.ac.shortToLongName(latestGame.name)} data for ${villager.name}`)
            .addField("Personality", `${utils.ac.getPersonality(latestGame).name}; ${utils.ac.getPersonality(latestGame).description}`, true)
            .addField("Song", latestGame.song ? latestGame.song : "No Song", true)
    } else if (typeof game == "object") {
        embed.setTitle(`${utils.ac.shortToLongName(gameName)} data for ${villager.name}`)
            .addField("Personality", `${utils.ac.getPersonality(game).name}; ${utils.ac.getPersonality(game).description}`, true)
            .addField("Song", game.song ? game.song : "No Song", true)
    } else embed.setDescription(`No data for game ${args.slice(nameHasSpace ? 2 : 1).join(" ")}`);

    msg.channel.send(embed)
        .catch(() => msg.channel.send("I need the attach files permission in this channel to use this command!").catch(() => { }));
}

exports.name = "Villager";
exports.info = "Shows info about an Animal Crossing villager";
exports.usage = "villager <villager name> [game name]";
exports.aliases = ["vil"];
