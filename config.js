const config = (property) => {
    if (property) return this[property];
    else return this;
};

config.token = process.env.DISCORD_TOKEN;
config.prefix = ",";

module.exports = config;
