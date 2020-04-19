const meant = require("meant");

let villagers = require("../data/villagers.json");

let mean = meant(process.argv[2] ? process.argv.slice(2).join(" ") : "ace1", Object.keys(villagers))[0];

console.log(mean);
