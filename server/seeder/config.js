let Config = require("../models/Config");

async function seedConfig () {
    let config = new Config({
        referralReward: 10,
        tenUsersReward: 100,
    });

    await config.save();
}


module.exports = seedConfig;