var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Wallet = mongoose.model('Wallet');
var User = mongoose.model('User');
var Asset = mongoose.model('Asset');
var Transaction = mongoose.model('Transaction');
var Prices = mongoose.model('Prices');
const Moralis = require("moralis").default;

function getKarmaLevel(wallet, asset){

    let index = wallet.assets.findIndex(asset => asset.symbol === "EBCT");
    if (index === -1) {
        return asset.karmaOne/100;
    }
    
    let amount = wallet.assets[index].holding;
    
    if(amount >= 0 && amount < 49999){
        return asset.karmaOne/100;
    }
    else if(amount >= 50000 && amount < 199999){
        return asset.karmaTwo/100;
    }
    else if(amount >= 200000 && amount < 1000000){
        return asset.karmaThree/100;
    }
    else if(amount >= 1000000){
        return asset.karmaFour/100;
    }
}

function getInterestLevel(wallet, asset){

    let index = wallet.assets.findIndex(asset => asset.symbol === "EBCT");
    if (index === -1) {
        return asset.interestOne/100;
    }
    
    let amount = wallet.assets[index].holding;
    
    if(amount >= 1 && amount < 49999){
        return asset.interestOne/100;
    }
    else if(amount >= 50000 && amount < 199999){
        return asset.interestTwo/100;
    }
    else if(amount >= 200000 && amount <= 1000000){
        return asset.interestThree/100;
    }
    else if(amount >=1000000){
        return asset.interestFour/100;
    }
    else{
        return 0;
    }

}

var job = new CronJob('0 0 * * *', async function() {

    console.log('cron job started');

    let wallets = await Wallet.find({});
    let assets = await Asset.find({});

    for(let wallet of wallets){
        
            let data = {};

            for(let asset of wallet.assets){
                
                if(asset.holdCountDown > 0){
                    let i = assets.findIndex(a => a.name === asset.symbol);
                    let amount = getKarmaLevel(wallet, assets[i])/30 * asset.holding;
                    console.log("==============", amount, wallet._id);
                    asset.earned += amount;
                    data[asset.symbol] = amount;
                    asset.holdCountDown--;
                    
                    if(asset.holdCountDown === 0){
                        asset.holding += asset.earned;
                        let user = await User.findOne({wallet: wallet._id});
                        let transaction = new Transaction({
                            amount: asset.earned,
                            type: 7,
                            status: 1,
                            asset: asset.symbol,
                            by: user._id
                        })    
                        await transaction.save();
                        asset.earned = 0;
                        asset.holdCountDown = 30;
                    }
                }
    
            }
        
            wallet.oneMonth.push(data);

            let usdt = assets.find(a => a.name === "USDT");
            let usdc = assets.find(a => a.name === "USDC");

            if(wallet.usdcBorrow.amount > 0){
                if(!wallet.usdcBorrow.interest) wallet.usdcBorrow.interest = 0;
                wallet.usdcBorrow.interest += wallet.usdcBorrow.amount * (getInterestLevel(wallet, usdc)/30);
                wallet.usdcBorrow.countDown++;
            }

            if(wallet.usdtBorrow.amount > 0){
                if(!wallet.usdtBorrow.interest) wallet.usdtBorrow.interest = 0;
                wallet.usdtBorrow.interest += wallet.usdtBorrow.amount * (getInterestLevel(wallet, usdt)/30);
                wallet.usdtBorrow.countDown++;
            }
            
            await wallet.save();
        }
})

job.start();


var job2 = new CronJob('* * * * *', async function() {
    console.log('prices seeding started');
    Asset.find({}, async (err, assets) => {
        console.log("called = >>>")
        await Moralis.start({ apiKey: "GYmc9V0D3I6GANObpb9BieIt1Xg36O4Oeeejk9434JmtfB7f50BwfXhj0m526QA2" });
        let prices = {};
         Promise.all([
             new Promise(async (resolve, reject) => {
                let count = 0;
                assets.map(async (asset) => {
                    try{

                        let data = await Moralis.EvmApi.token.getTokenPrice({
                            chain: '0x38',
                            address: asset.address
                        });
                        console.log(data.result.usdPrice)
                        prices[asset.name] = (data.result.usdPrice);
                    }catch(e){
                        console.log(asset, e);
                    }
                    count++;
                    if (count === assets.length) resolve(prices);
                })

             })
            ]).then(async () => {
                await Prices.findOneAndUpdate({}, { assets: prices }, { upsert: true })
         })
    });
})

job2.start();