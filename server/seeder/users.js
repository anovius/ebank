let faker = require("faker");
const moment = require("moment");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
let mongoose = require("mongoose");

async function seedUsers() {

  {let adminUser = new User();
  adminUser.email = "admin@gmail.com";
  adminUser.name = "Admin";
  adminUser.role = 2;
  adminUser.status = 1;
  let wallet = new Wallet();
  await wallet.save();
  adminUser.wallet = wallet._id;
  adminUser.setPassword("Asdf123");
  await adminUser.save();}

  {let adminUser = new User();
    adminUser.email = "erosbankinfo@gmail.com";
    adminUser.name = "Admin";
    adminUser.role = 2;
    adminUser.status = 1;
    let wallet = new Wallet();
    await wallet.save();
    adminUser.wallet = wallet._id;
    adminUser.setPassword("Asdf123");
    await adminUser.save();}

    {let adminUser = new User();
      adminUser.email = "iqrarhussain471@gmail.com";
      adminUser.name = "Admin";
      adminUser.role = 2;
      let wallet = new Wallet();
      await wallet.save();
      adminUser.wallet = wallet._id;
      adminUser.status = 1;
      adminUser.setPassword("Asdf123");
      await adminUser.save();}

  console.log("Users seeded");
}

module.exports = seedUsers;
