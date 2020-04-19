const { MessageEmbed } = require("discord.js"),
    fetch = require("node-fetch"),
    { Worker } = require("worker_threads"),
    utils = require("../../utilities/utils");

exports.run = (bot, msg, args) => {
    return new Promise((res, rej) => {
        if (!args || !args[0]) return res(1);
        let name = args.join(" ").replace(/-/g, " ").split(" ");

        const getItem = new Worker(`${dir}/utilities/workers/getItem.js`, {
            "workerData": {
                "name": name
            }
        });

        getItem.on("error", (e) => {
            res(2);
        });

        getItem.on("message", async (data) => {
            getItem.terminate();
            if (data.code) res(data.code);

            if (data == 1) return msg.channel.send(`Item "${args.join(" ")}" not found!`);

            let item = data.item;

            let game = name.slice(data.nameSpaceCount + 1).join(" ").toLowerCase();
            if (game.startsWith("ac") && game.length > 2) game = game.slice(2);
            game = utils.ac.longToShortName(game);
            let gameName = game;
            game = item.games[game] ? item.games[game] : game;

            let latestGame = utils.ac.getLatestGame(item);
            let embed = new MessageEmbed();

            embed.setColor(msg.guild ? msg.guild.me.displayColor : 0x00ADFF)
                .setTitle(`Data for ${item.name}`)
                .addField("Games", utils.ac.shortToLongName(Object.keys(item.games)).join(", "), true)
                .setFooter(msg.guild ? msg.guild.me.displayName : bot.user.username, bot.user.displayAvatarURL({
                    "format": "png",
                    "size": 2048
                }));

            if (!game) {
                embed.setTitle(`${utils.ac.shortToLongName(latestGame.name)} data for ${item.name}`);
                embed.addField("Sell price (bells)", latestGame.sellPrice ? latestGame.sellPrice.value : "Cannot sell", true);
                embed.addField("Buy price (bells)", latestGame.buyPrices ? latestGame.buyPrices.find((x) => x.currency == "bells") ? latestGame.buyPrices.find((x) => x.currency == "bells").value : "Cannot buy" : "Cannot buy", true);
            } else if (typeof game == "object") {
                embed.setTitle(`${utils.ac.shortToLongName(gameName)} data for ${item.name}`);
                embed.addField("Sell price (bells)", game.sellPrice ? game.sellPrice.value : "Cannot sell", true);
                embed.addField("Buy price (bells)", game.buyPrices ? game.buyPrices.find((x) => x.currency == "bells") ? game.buyPrices.find((x) => x.currency == "bells").value : "Cannot buy" : "Cannot buy", true);
            } else embed.setDescription(`No data for game ${utils.ac.shortToLongName(gameName)}`);


            try {
                let data = await fetch(`https://villagerdb.com/images/items/full/${item.id}.png`, {
                    "method": "head"
                });

                if (data.ok) embed.setThumbnail(`https://villagerdb.com/images/items/full/${item.id}.png`);
                else {
                    data = await fetch(`https://villagerdb.com/images/items/full/${item.id}.jpg`, {
                        "method": "head"
                    });
                    if (data.ok) embed.setThumbnail(`https://villagerdb.com/images/items/full/${item.id}.jpg`);
                }
            } catch { };

            msg.channel.send(embed)
                .catch(() => msg.channel.send("I need the attach files permission in this channel to use this command!").catch(() => { }));

        });
    });
}

exports.name = "Item";
exports.info = "Shows info about an Animal Crossing item";
exports.usage = "item <item name> [game name]";
