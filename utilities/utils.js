const utils = () => {
    return new Error("Utils");
}
utils.ac = () => { return "Animal Crossing Utils" };
utils.ac.discord = () => { return "Discord Animal Crossing Utils" };

function getDayString(day) {
    if (day.startsWith("1") && day.length > 1) return `${day}th`;

    if (day.endsWith("1")) return `${day}st`
    else if (day.endsWith("2")) return `${day}nd`
    else if (day.endsWith("3")) return `${day}rd`
    else return `${day}th`;
}

function getMonthString(month) {
    let months = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October",
        "November", "December"
    ]
    return months[parseInt(month) - 1];
}

function getMonthAndDateString(date) {
    let month = getMonthString(date.split("-")[0]);
    let day = getDayString(date.split("-")[1]);

    return `${month} ${day}`;
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


function shortToLongName(name) {
    let names = {
        "nh": "New Horizons",
        "nl": "New Leaf",
        "cf": "City Folk",
        "ww": "Wild World",
        "afe+": "Doubutsu no Mori e+",
        "ac": "Animal Crossing"
    }

    if (typeof name == "string") {
        if (names[name]) return names[name];
        else return name;
    } else if (typeof name == "object") {
        if (!name.length) return name;
        for (let i = 0; i < name.length; i++) {
            if (!name[i]) break;
            if (names[name[i]]) name[i] = names[name[i]];
        }
        return name;
    }
}

function longToShortName(name) {
    let names = {
        "new horizons": "nh",
        "new leaf": "nl",
        "city folk": "cf",
        "wild world": "ww",
        "doubutsu no mori e+": "afe+",
        "animal crossing": "ac"
    }

    if (typeof name == "string") {
        if (names[name.toLowerCase()]) return names[name.toLowerCase()];
        else return name;
    } else if (typeof name == "object") {
        if (!name.length) return name;
        for (let i = 0; i < name.length; i++) {
            if (!name[i]) break;
            if (names[name[i].toLowerCase()]) name[i] = names[name[i].toLowerCase()];
        }
        return name;
    }
}

function testForGameName(str) {
    let games = [
        "new horizons", "nh",
        "new leaf", "nl",
        "city folk", "cf",
        "wild world", "ww",
        "doubutsu no mori e+", "afe+",
        "animal crossing", "ac"
    ]
    if (str.toLowerCase().startsWith("ac")) return true;
    if (games.indexOf(str.toLowerCase()) > -1) return true;
    return false;
}

function getLatestGame(data) {
    if (!data) return new Error("No object provided");
    if (!data.games) return new Error("No games property");
    let games = data.games,
        gameKeys = Object.keys(games);

    let game = games[gameKeys[gameKeys.length - 1]];
    game.name = gameKeys[gameKeys.length - 1];
    return game;
}

function getPersonality(game) {
    if (!game) return new Error("No game object provided");
    if (!game.personality && typeof game != "string") return new Error("No personality property");

    let personalities = require("../data/personalities.json");
    let personalityName = typeof game == "string" ? game.toLowerCase() : game.personality.toLowerCase();

    let personality = personalities[personalityName];

    if (!personality) return {
        "id": "none found",
        "name": "none found",
        "description": "no personality data found"
    };

    return personality;
}

utils.getDayString = getDayString;
utils.getMonthString = getMonthString;
utils.getMonthAndDateString = getMonthAndDateString;
utils.toTitleCase = toTitleCase;

utils.ac.shortToLongName = shortToLongName;
utils.ac.longToShortName = longToShortName;
utils.ac.getLatestGame = getLatestGame;
utils.ac.testForGameName = testForGameName;
utils.ac.getPersonality = getPersonality;

module.exports = utils;
