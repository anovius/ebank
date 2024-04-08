require('dotenv').config();
const mongoose = require('mongoose');
const Prices = require('./models/Prices');


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



  async function seedPrices() {
    console.log("seeding prices");
    let prices = new Prices();
    prices.assets = null
    await prices.save();
  }
  
  require('./models/User');
  require('./models/Asset');

  const seedUsers = require('./seeder/users');
  const seedAssets = require('./seeder/assets');
  const seedConfig = require('./seeder/config');
async function init() {
  // console.log("dropping DB");
  // await mongoose.connection.db.dropDatabase();
  // await seedUsers();
  // await seedAssets();
  // await seedPrices();

  await seedConfig();
  exit();
}
function exit() {
  console.log('exiting')
  process.exit(1)
}
