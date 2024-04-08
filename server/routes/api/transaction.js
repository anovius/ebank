let mongoose = require("mongoose");
let router = require("express").Router();
let User = mongoose.model("User");
let Wallet = mongoose.model("Wallet");
let Asset = mongoose.model("Asset");
let Prices = mongoose.model("Prices");
let Transaction = mongoose.model("Transaction");
let Config = mongoose.model("Config");
let auth = require("../auth");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
let config = require("../../config");

router.post('/deposit', auth.required, auth.user, (req, res, next) => {
    if (!req.body.transaction) {
        return next(new BadRequestResponse("Transaction is required"));
    }

    let transaction = new Transaction(req.body.transaction);
    transaction.type = 1;
    transaction.by = req.user._id;
    transaction.save((err, transaction) => {
        if (err || !transaction) {
            next(new BadRequestResponse(err));
        }
        else {
            next(new OkResponse({ message: "Transaction successfully" }));
        }
    });
});

router.post('/withdraw', auth.required, auth.user, (req, res, next) => {
    if (!req.body.transaction) {
        return next(new BadRequestResponse("Transaction is required"));
    }

    let transaction = new Transaction(req.body.transaction);
    transaction.type = 2;
    transaction.by = req.user._id;
    transaction.save((err, transaction) => {
        if (err || !transaction) {
            next(new BadRequestResponse(err));
        }
        else {
            next(new OkResponse({ message: "Transaction successfully" }));
        }
    });
});

router.get('/get/all', auth.required, auth.user, (req, res, next) => {
    Transaction.find({ by: req.user._id }, (err, transactions) => {
        if (err || !transactions) {
            next(new BadRequestResponse(err));
        }

        else {
            transactions = transactions.reverse();
            next(new OkResponse({ transactions }));
        }
    });
});

router.get('/get/admin', auth.required, auth.admin, (req, res, next) => {
    let query = {
        type: req.query.type || 1,
    };
    Transaction.find(query, (err, transactions) => {
        console.log(transactions);
        if (err || !transactions) {
            next(new BadRequestResponse(err));
        }
        else {
            next(new OkResponse({ transactions }));
        }
    });
});

router.put('/status/:id/:status', auth.required, auth.admin, (req, res, next) => {
    Transaction.findById(req.params.id, (err, transaction) => {
        if (err || !transaction) {
            next(new BadRequestResponse(err));
        }
        else {
            if (transaction.type === 1){
                let prevStatus = transaction.status;
                transaction.status = +req.params.status;
                transaction.save((err, transaction) => {
                    if (err || !transaction) {
                        next(new BadRequestResponse(err));
                    }
                    else {
                        let index = transaction.by.wallet.assets.findIndex((a) => a.symbol === transaction.asset);
                        if(+req.params.status === 1) {
                            if(index > -1){
                                transaction.by.wallet.assets[index].amount += transaction.amount;
                                console.log("i am called");
                            }
                            else{
                                transaction.by.wallet.assets.push({
                                    symbol: transaction.asset,
                                    amount: transaction.amount,
                                });
                            }

                        }
                        else if(prevStatus === 1){
                            transaction.by.wallet.assets[index].amount -= transaction.amount;
                        }
                        transaction.by.wallet.save((err, wallet) => {
                            if (err || !wallet) {
                                next(new BadRequestResponse(err));
                            }
                            else {
                                next(new OkResponse({ message: "Update successfully" }));
                            }
                        });
                    }
                });
            }
            else{
                let prevStatus = transaction.status;
                transaction.status = +req.params.status;
                transaction.save((err, transaction) => {
                    if (err || !transaction) {
                        next(new BadRequestResponse(err));
                    }
                    else {
                        let index = transaction.by.wallet.assets.findIndex((a) => a.symbol === transaction.asset);
                        if(+req.params.status === 1) {
                            if(index > -1 && transaction.by.wallet.assets[index].amount >= transaction.amount){
                                transaction.by.wallet.assets[index].amount -= transaction.amount;
                            }
                        }
                        else if(prevStatus === 1){
                            transaction.by.wallet.assets[index].amount += transaction.amount;
                        }
                        transaction.by.wallet.save((err, wallet) => {
                            if (err || !wallet) {
                                next(new BadRequestResponse(err));
                            }
                            else {
                                next(new OkResponse({ message: "Update successfully" }));
                            }
                        });
                    }
                });
            }
        }
    });
})

router.get('/wallet', auth.required, auth.user, (req, res, next) => {
    next(new OkResponse({ wallet: req.user.wallet }));
});


router.post('/convert', auth.required, auth.user, (req, res, next) => {
    let fromAsset = req.body.fromAsset;
    let toAsset = req.body.toAsset;
    let wallet = req.user.wallet;

    console.log(fromAsset, toAsset);

    let fromAssetIndex = wallet.assets.findIndex(asset => asset.symbol === fromAsset.name);
    let toAssetIndex = wallet.assets.findIndex(asset => asset.symbol === toAsset.name);

    if(fromAssetIndex === -1){
        return next(new BadRequestResponse("Asset not found"));
    }

    if(fromAsset.amount > wallet.assets[fromAssetIndex].amount){
        return next(new BadRequestResponse("Not enough asset"));
    }

    wallet.assets[fromAssetIndex].amount -= fromAsset.amount;
    if(toAssetIndex === -1){
        wallet.assets.push({
            symbol: toAsset.name,
            amount: toAsset.amount,
        });
    }
    else{
        wallet.assets[toAssetIndex].amount = wallet.assets[toAssetIndex].amount+ toAsset.amount;
    }
    wallet.save((err, wallet) => {
        if (err || !wallet) {
            next(new BadRequestResponse(err));
        }
        else {
            next(new OkResponse({ message: "Convert successfully" }));
        }
    })
})


async function checkReferralCode(user) {
    if (user.refereedBy === '') return;
    let foundUser = await User.findOne({ referralCode:user.refereedBy });
    let config = await Config.findOne({});

    if (!foundUser) {
        user.refereedBy = "";
        await user.save();
        return;
    }

    let index = foundUser.wallet.assets.findIndex((a) => a.symbol === "EBCT");
    let transaction = new Transaction({
        by: foundUser,
        asset: "EBCT",
        status: 1,
    });
    if(index > -1){
        if(foundUser.referralCounter === 10){
            foundUser.wallet.assets[index].amount += config.tenUsersReward;
            foundUser.referralCounter = 0;
            transaction.amount = config.tenUsersReward;
            transaction.type = 9;
        }
        else{
            foundUser.wallet.assets[index].amount += config.referralReward;
            transaction.amount = config.referralReward;
            transaction.type = 8;
        }
    }
    else{
        if(foundUser.referralCounter === 10){
            foundUser.wallet.assets.push({
                symbol: "EBCT",
                amount: config.tenUsersReward,
            });
            foundUser.referralCounter = 0;
            transaction.amount = config.tenUsersReward;
            transaction.type = 9;
        }
        else{
            foundUser.wallet.assets.push({
                symbol: "EBCT",
                amount: config.referralReward,
            });
            transaction.amount = config.referralReward;
            transaction.type = 8;
        }
    }

    await foundUser.wallet.save();
    await transaction.save();


    user.refereedBy = "";
    await user.save();

    console.log("Referral code used ==============================");

} 

router.post('/hold', auth.required, auth.user, (req, res, next) => {
    if(!req.body.hold){
        return next(new BadRequestResponse("Hold is required"));
    }

    
    let hold = req.body.hold;
    let wallet = req.user.wallet;
    let index = wallet.assets.findIndex((a) => a.symbol === hold.asset);
    if(!wallet.assets[index].holdCountDown || wallet.assets[index].holdCountDown === 0){
        wallet.assets[index].holdCountDown = 30;
    }
    console.log(wallet.assets, req.body.hold);
    if(index === -1 || wallet.assets[index].amount < hold.amount){
        return next(new BadRequestResponse("Not enough asset"));
    }

    wallet.assets[index].amount -= hold.amount;
    wallet.assets[index].holding += hold.amount;

    if(!wallet.holding) wallet.holding = [];

    wallet.holding.push({
        symbol: hold.asset,
        amount: hold.amount,
        date: new Date(),
    });

    wallet.save((err, wallet) => {
        if (err || !wallet) {
            
            next(new BadRequestResponse(err));
        }
        else {
            let transaction = new Transaction({
                type: 3,
                status: 1,
                by: req.user._id,
                asset: hold.asset,
                amount: hold.amount,
            });

            transaction.save((err, transaction) => {
                checkReferralCode(req.user);
                next(new OkResponse({ message: "Hold successfully" }));
            })
        }
    });
});

router.post('/redeem', auth.required, auth.user, (req, res, next) => {
    if(!req.body.redeem){
        return next(new BadRequestResponse("Redeem is required"));
    }

    let redeem = req.body.redeem;
    let wallet = req.user.wallet;
    let index = wallet.assets.findIndex((a) => a.symbol === redeem.asset);

    if(index === -1 || wallet.assets[index].holding < redeem.amount){
        return next(new BadRequestResponse("Not enough asset"));
    }

    wallet.assets[index].amount += redeem.amount;
    wallet.assets[index].holding -= redeem.amount;

    if(wallet.assets[index].holding === 0){
        wallet.assets[index].amount += wallet.assets[index].earned;
        wallet.assets[index].earned = 0;
        wallet.assets[index].holdCountDown = 0;
    }

    wallet.holding = wallet.holding.filter(hold => hold.symbol !== redeem.asset);

    wallet.save((err, wallet) => {
        if (err || !wallet) {
            next(new BadRequestResponse(err));
        }
        else {
            let transaction = new Transaction({
                type: 4,
                by: req.user._id,
                asset: redeem.asset,
                status: 1,
                amount: redeem.amount,
            });

            transaction.save((err, transaction) => {
                next(new OkResponse({ message: "Redeem successfully" }));
            })
        }
    });
});

router.post('/borrow', auth.required, auth.user, (req, res, next) => {
    let wallet = req.user.wallet;

    if(!req.body.borrow){
        return next(new BadRequestResponse("Borrow is required"));
    }

    let toAssetIndex = wallet.assets.findIndex(asset => asset.symbol === req.body.borrow.amountSymbol);
    let fromIndex = wallet.assets.findIndex((a) => a.symbol === req.body.borrow.collateralSymbol);

    if(fromIndex === -1){
        return next(new BadRequestResponse("Asset not found"));
    }

    if(wallet.assets[fromIndex].amount < req.body.borrow.collateral){
        return next(new BadRequestResponse("Not enough asset"));
    }

    if(req.body.borrow.amountSymbol === 'USDC' && wallet.usdcBorrow.amount > 0 ){
        return next(new BadRequestResponse("You have already borrowed USDC"));
    }

    if(req.body.borrow.amountSymbol === 'USDT' && wallet.usdtBorrow.amount > 0){
        return next(new BadRequestResponse("You have already borrowed USDC"));
    }

    if(toAssetIndex === -1){
        wallet.assets.push({
            symbol: req.body.borrow.amountSymbol,
            amount: 0,
        });

        toAssetIndex = wallet.assets.length - 1;
    }

    wallet.assets[fromIndex].amount -= req.body.borrow.collateral;
    wallet.assets[toAssetIndex].amount += req.body.borrow.amount;

    if(!wallet.borrow) wallet.borrow = [];

    if(req.body.borrow.amountSymbol === 'USDT'){
        wallet.usdtBorrow = {
            amount: req.body.borrow.amount,
            collateral: req.body.borrow.collateral,
            collateralSymbol: req.body.borrow.collateralSymbol,
            countDown: 0
        }
    }
    else if(req.body.borrow.amountSymbol === 'USDC'){
        wallet.usdcBorrow = {
            amount: req.body.borrow.amount,
            collateral: req.body.borrow.collateral,
            collateralSymbol: req.body.borrow.collateralSymbol,
            countDown: 0
        }
    }

    wallet.save((err, wallet) => {
        if (err || !wallet) {
            next(new BadRequestResponse(err));
        }
        else {
            let transaction = new Transaction({
                type: 5,
                status: 1,
                by: req.user._id,
                asset: req.body.borrow.amountSymbol,
                amount: req.body.borrow.amount,
            })

            transaction.save((err, transaction) => {
                next(new OkResponse({ message: "Borrow successfully" }));
            })
        }
    })

})

router.get('/borrow/assets', auth.required, auth.user, (req, res, next) => {
    let wallet = req.user.wallet;

    let data = {
        "USDC": wallet.usdcBorrow.amount || 0,
        "USDT": wallet.usdtBorrow.amount || 0,
    }

    next(new OkResponse(data));
});

router.post('/borrow/repay', auth.required, auth.user, async (req, res, next) => {
    if(!req.body.asset){
        return next(new BadRequestResponse("Asset is required"));
    }

    let prices = await Prices.findOne({});

    let wallet = req.user.wallet;
    let index = wallet.assets.findIndex((a) => a.symbol === req.body.asset);

    if(req.body.asset === "USDT"){
        if(wallet.usdtBorrow.amount < wallet.assets[index].amount){
            wallet.assets[index].amount -= wallet.usdtBorrow.amount;
        }
        else{
            let remaining = wallet.usdtBorrow.amount - wallet.assets[index].amount;
            wallet.assets[index].amount = 0;
            let col = wallet.assets.findIndex((a) => a.symbol === wallet.usdtBorrow.collateralSymbol);
            let colPrice = 1 / prices.assets[wallet.usdtBorrow.collateralSymbol];
            remaining = remaining * colPrice;
            console.log(remaining);
            wallet.assets[col].amount -= remaining;
        }

        wallet.usdtBorrow = {
            amount: 0,
            collateral: 0,
            collateralSymbol: '',
            interest: 0,
            countDown: 0
        }

        let transaction = new Transaction({
            type: 6,
            by: req.user._id,
            asset: req.body.asset,
            status: 1,
            amount: wallet.usdtBorrow.amount,
        })

        await transaction.save();
    }

    if(req.body.asset === "USDC"){
        if(wallet.usdcBorrow.amount < wallet.assets[index].amount){
            wallet.assets[index].amount -= wallet.usdcBorrow.amount;
        }
        else{
            let remaining = wallet.usdcBorrow.amount - wallet.assets[index].amount;
            wallet.assets[index].amount = 0;
            let col = wallet.assets.findIndex((a) => a.symbol === wallet.usdcBorrow.collateralSymbol);
            let colPrice = 1 / prices.assets[wallet.usdcBorrow.collateralSymbol];
            remaining = remaining * colPrice;
            console.log(remaining);
            wallet.assets[col].amount -= remaining;
        }

        wallet.usdcBorrow = {
            amount: 0,
            collateral: 0,
            collateralSymbol: '',
            interest: 0,
            countDown: 0
        }

        let transaction = new Transaction({
            type: 6,
            status: 1,
            by: req.user._id,
            asset: req.body.asset,
            amount: wallet.usdcBorrow.amount,
        })

        await transaction.save();
    }

    await wallet.save();

});

router.get('/get/user/:email', auth.required, auth.admin, (req, res, next) => {
    User.findOne({ email: req.params.email }, (err, user) => {
        if (err || !user) {
            next(new BadRequestResponse(err));
        }
        else {
            Transaction.find({ by: user._id }, (err, transactions) => {
                if (err || !transactions) {
                    next(new BadRequestResponse(err));
                }
                else {
                    next(new OkResponse(transactions));
                }
            })
        }
    })
})

router.put('/update', auth.required, auth.admin, (req, res, next) => {
    Transaction.findById(req.body.id, (err, transaction) => {
        if (err || !transaction) {
            return next(new BadRequestResponse(err));
        }

        let oldAmount = transaction.amount;
        let wallet = transaction.by.wallet;
        let index = wallet.assets.findIndex((a) => a.symbol === transaction.asset);

        console.log(index);

        if(index === -1){
            return next(new BadRequestResponse("Asset not found"));
        }

        wallet.assets[index].amount += req.body.amount - oldAmount;
        wallet.save((err, wallet) => {
            transaction.amount = req.body.amount;
            transaction.save((err, transaction) => {
                next(new OkResponse({ message: "Update successfully" }));
            })
        })
    });
})

module.exports = router;