let mongoose = require("mongoose");
let router = require("express").Router();
let User = mongoose.model("User");
let Prices = mongoose.model("Prices");
let Asset = mongoose.model("Asset");
let auth = require("../auth");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

let config = require("../../config");

router.param("id", (req, res, next, id) => {
    Asset.findById(id, (err, asset) => {
        if (err || !asset) {
            next(new BadRequestResponse(err));
        } else {
            req.asset = asset;
            next();
        }
    });
})

router.get("/get/all", (req, res, next) => {
    Asset.find({}, (err, assets) => {
        if (err || !assets) {
            next(new BadRequestResponse(err));
        } else {
            next(new OkResponse({ assets }));
        }
    });
});

router.post("/add", auth.required, auth.admin, (req, res, next) => {
    let asset = new Asset(req.body.asset);
    asset.save((err, asset) => {
        if (err || !asset) {
            next(new BadRequestResponse(err));
        } else {
            next(new OkResponse({ asset:asset }));
        }
    });
})

router.post('/status/:id', auth.required, auth.admin, (req, res, next) => {
    let asset = req.asset;
    asset.status = req.body.status;
    asset.save((err, asset) => {
        if (err || !asset) {
            next(new BadRequestResponse(err));
        } else {
            next(new OkResponse("Asset status updated"));
        }
    });
});

router.put('/update/:id', auth.required, auth.admin, (req, res, next) => {
    let asset = req.asset;
    asset.name = req.body.asset.name || asset.name;
    asset.icon = req.body.asset.icon || asset.icon;
    asset.full = req.body.asset.full || asset.full;
    asset.min = req.body.asset.min || asset.min;
    asset.max = req.body.asset.max || asset.max;
    asset.conversion = req.body.asset.conversion || asset.conversion;
    asset.percentageCharge = req.body.asset.percentageCharge || asset.percentageCharge;
    asset.fixCharge = req.body.asset.fixCharge || asset.fixCharge;
    asset.address = req.body.asset.address || asset.address;
    asset.karmaOne = req.body.asset.karmaOne || asset.karmaOne;
    asset.karmaTwo = req.body.asset.karmaTwo || asset.karmaTwo;
    asset.karmaThree = req.body.asset.karmaThree || asset.karmaThree;
    asset.karmaFour = req.body.asset.karmaFour || asset.karmaFour;
    asset.walletAddress = req.body.asset.walletAddress || asset.walletAddress;
    asset.interestOne = req.body.asset.interestOne || asset.interestOne;
    asset.interestTwo = req.body.asset.interestTwo || asset.interestTwo;
    asset.interestThree = req.body.asset.interestThree || asset.interestThree;
    asset.interestFour = req.body.asset.interestFour || asset.interestFour;
    asset.stats = req.body.asset.stats || asset.stats;
    asset.save((err, asset) => {
        if (err || !asset) {
            next(new BadRequestResponse(err));
        } else {
            next(new OkResponse("Asset updated"));
        }
    });
})

router.get('/prices', (req, res, next) => {
   let prices = {};
         Promise.all([
             new Promise(async (resolve, reject) => {
                Prices.findOne({}, async (err, price) => {
                    prices = price.assets;
                    resolve(prices);
                })
             })
            ]).then(() => {
            next(new OkResponse(prices));
         })
});


router.get('/my/stats', auth.required, auth.user, async (req, res, next) => {
    let prices = await Prices.findOne({});
    let stats = req.user.wallet.oneMonth;
    stats.reverse();
    let one = 0;
    let seven = 0;
    let thirty = 0;

    for (let i = 0; i < stats.length; i++) {
        let amount = 0;

        Object.keys(stats[i]).forEach(key => {
            console.log(stats[i][key] * prices.assets[key]);
            amount += stats[i][key] * prices.assets[key];
        })

        if(i < 1) {
            one += amount;
        }

        if(i < 7) {
            seven += amount;
        }

        if(i < 30) {
            thirty += amount;
        }
    }

    next(new OkResponse({
        oneDay: one,
        sevenDay: seven,
        thirtyDay: thirty 
    }))

})


router.get('/my/assets', auth.required, auth.user, async (req, res, next) => {

let prices = {};
         Promise.all([
             new Promise(async (resolve, reject) => {
                Prices.findOne({}, async (err, price) => {
                    prices = price.assets;
                    resolve(prices);
                })
             })
            ]).then(() => {
                
                let wallet = req.user.wallet;
                let total = 0;
                let inWallet = 0;
                let totalHolding = 0;
                let totalBorrow = 0;
                let totalEbct = 0;
                let assets = {};
                let holding = {};
                let borrow = {};

                if(wallet.assets){
                    wallet.assets.map(async asset => {
                        assets[asset.symbol] = asset.amount;
                        holding[asset.symbol] = asset.holding;
                    });
                }

                borrow["USDC"] = wallet.usdcBorrow.amount || 0;
                borrow["USDT"] = wallet.usdtBorrow.amount || 0;

                if(Object.keys(assets)){
                    (Object.keys(assets)).map(async key => {
                        inWallet += assets[key] * prices[key]
                    })
                }
                
                if(Object.keys(holding)){
                    (Object.keys(holding)).map(async key => {
                        totalHolding += holding[key] * prices[key]
                    })
                }

                if(Object.keys(borrow)){
                    (Object.keys(borrow)).map(async key => {
                        totalBorrow += borrow[key] * prices[key]
                    })
                }

                console.log(assets, borrow, holding);


                total = inWallet + totalHolding;
                totalEbct = (assets["EBCT"] + holding["EBCT"]) * prices["EBCT"]; 

                next(new OkResponse({
                    total: total,
                    inWallet: inWallet,
                    totalHolding: totalHolding,
                    totalBorrow: totalBorrow,
                    totalEbct: totalEbct
                }))

         })
})


router.get('/earn/:name', auth.required, auth.user, async (req, res, next) => {
    let wallet = req.user.wallet;
    let totTotalHold = 0;
    let totalEarnings = 0;
    
    let index = wallet.assets.findIndex(asset => asset.symbol === req.params.name);
    if(index === -1) {
        return next(new OkResponse({
            hold: {
                total: 0,
                price: 0
            },
            earnings: {
                total: 0,
                price: 0
            },
            nextDay: 0
        }))
    }
    totTotalHold = wallet.assets[index].holding || 0;
    totalEarnings = wallet.assets[index].earned || 0;
    
    let nextDay = wallet.assets[index].holdCountDown
    let prices = await Prices.findOne({});

    next(new OkResponse({
        hold: {
            total: totTotalHold,
            price: (totTotalHold * prices.assets[req.params.name]) || 0
        },
        earnings: {
            total: totalEarnings,
            price: (totalEarnings * prices.assets[req.params.name]) || 0
        },
        nextDay: nextDay
    }))
})

router.get('/borrow/:name', auth.required, auth.user, async (req, res, next) => {
    let wallet = req.user.wallet;
    let asset = {}

    if(req.params.name === "USDC") {
        asset = wallet.usdcBorrow;
    }
    if(req.params.name === "USDT") {
        asset = wallet.usdtBorrow;
    }

    let prices = await Prices.findOne({});

    next(new OkResponse({
        countDown: asset.countDown,
        loan: asset.amount,
        price: (asset.amount * prices.assets[req.params.name]) || 0,
        interest: (asset.interest + asset.amount),
        interestPrice : ((asset.interest + asset.amount) * prices.assets[req.params.name]) || 0,
    }))
})


router.get("/get/special", (req, res, next) => {
    Asset.find({}, (err, assets) => {
        if (err || !assets) {
            next(new BadRequestResponse(err));
        } else {
            let data = {}

            assets.map(asset => {
                data[asset.name] = {
                    name: asset.name,
                    icon: asset.icon,
                    description: `The EBankc ${asset.name} portfolio offers the best short term interest rate of up to 8% in 30 days. It lets you enjoy market volatility while earning passively on the crypto.`,
                    lvl1: asset.karmaOne,
                    lvl1range: "0 - 49,999",
                    lvl2: asset.karmaTwo,
                    lvl2range: "50,000 - 199,999",
                    lvl3: asset.karmaThree,
                    lvl3range: "200,000 - 1,000,000",
                    lvl4: asset.karmaFour,
                    lvl4range: "Above 1,000,000",
                    autoDeploy: false,
                }
            })

            next(new OkResponse(data))
        }
    });
});

module.exports = router;