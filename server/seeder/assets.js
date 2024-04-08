const Asset = require("../models/Asset");
let mongoose = require("mongoose");

async function seedAssets() {
    
    {
        let asset = new Asset();
        asset.icon = "/uploads/bitcoin.svg";
        asset.full = "Bitcoin";
        asset.name = "BTC";
        asset.min = 0.01138;
        asset.max = 234;
        asset.conversion = 0.01138;
        asset.percentageCharge = 0.01;
        asset.fixCharge = 0;
        asset.karmaOne = 2;
        asset.karmaTwo = 4;
        asset.karmaThree = 6;
        asset.karmaFour = 8;
        asset.stats = 25;
        asset.address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
        asset.walletAddress = "0xF354582e017B363254550e8e06A558596920eb20";
        await asset.save();
    }
    {
        let asset = new Asset();
        asset.icon = "/uploads/ethereum.svg";
        asset.full = "Ethereum";
        asset.name = "ETH";
        asset.min = 0.161678;
        asset.max = 234;
        asset.conversion = 0.01138;
        asset.percentageCharge = 0.01;
        asset.fixCharge = 0;
        asset.karmaOne = 2;
        asset.karmaTwo = 4;
        asset.karmaThree = 6;
        asset.karmaFour = 8;
        asset.stats = 1369;
        asset.address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        asset.walletAddress = "0xF354582e017B363254550e8e06A558596920eb20";
        await asset.save();
    }

    {
        let asset = new Asset();
        asset.icon = "/uploads/ebct.svg";
        asset.full = "EBCT";
        asset.name = "EBCT";
        asset.min = 0.161678;
        asset.max = 234;
        asset.conversion = 0.01138;
        asset.percentageCharge = 0.01;
        asset.fixCharge = 0;
        asset.karmaOne = 1;
        asset.karmaTwo = 2;
        asset.karmaThree = 3;
        asset.karmaFour = 4;
        asset.stats = 310000000;
        asset.address = "0xf8688fD01B8e5aC811b0cA51Be1af08457aB602a";
        asset.walletAddress = "0xF354582e017B363254550e8e06A558596920eb20";
        await asset.save();
    }

    {
        let asset = new Asset();
        asset.icon = "/uploads/usdt.svg";
        asset.full = "USDT";
        asset.name = "USDT";
        asset.min = 0.161678;
        asset.max = 234;
        asset.conversion = 0.01138;
        asset.percentageCharge = 0.02;
        asset.fixCharge = 0;
        asset.karmaOne = 3;
        asset.karmaTwo = 5;
        asset.karmaThree = 7;
        asset.karmaFour = 9;
        asset.interestOne = 4;
        asset.interestTwo = 3;
        asset.interestThree = 2;
        asset.interestFour = 1;
        asset.stats = 200000;
        asset.address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        asset.walletAddress = "0xF354582e017B363254550e8e06A558596920eb20";
        await asset.save();
    }

    {
        let asset = new Asset();
        asset.icon = "/uploads/usdc.svg";
        asset.full = "USDC";
        asset.name = "USDC";
        asset.min = 0.161678;
        asset.max = 234;
        asset.conversion = 0.01138;
        asset.percentageCharge = 0.02;
        asset.fixCharge = 0;
        asset.karmaOne = 3;
        asset.karmaTwo = 5;
        asset.karmaThree = 7;
        asset.karmaFour = 9;
        asset.interestOne = 4;
        asset.interestTwo = 3;
        asset.interestThree = 2;
        asset.interestFour = 1;
        asset.stats = 200000;
        asset.address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        asset.walletAddress = "0xF354582e017B363254550e8e06A558596920eb20";
        await asset.save();
    }
}

module.exports = seedAssets;
