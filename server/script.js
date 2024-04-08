const mongoose = require('mongoose');
const User = require('./models/User');
const slug = require("slug");
let exec = require('child_process').exec;


let con = mongoose.connect('mongodb://localhost:27017/ebank', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).catch(err => {
  console.log(err);
  process.exit(1);
})
  .then(() => {
    console.log("connected to db in development environment");
    init()
  });

require('./models/Wallet');

async function init() {

    //take backup of db

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let backupName = `ebank-${year}-${month}-${day}-${hour}-${minute}-${second}.json`;
    let backupPath = `../backups/${backupName}`;
    let backupCommand = `mongodump --db ebank --out ${backupPath}`;
    console.log(backupCommand);
    await exec(backupCommand);

    let users = await User.find({});

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        user.referralCode = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
        user.refereedBy = "";
        user.referralUsedBy = [];
        user.referralCounter = 0;

        await user.save();
    }

    exit();
}


function exit() {
  console.log('exiting')
  process.exit(1)
}
