let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let WalletSchema = new mongoose.Schema(
  {
    assets: [{
      symbol: {type: String, required: true},
      amount: {type: Number, required: true},
      holding: {type: Number, default: 0},
      earned: {type: Number, default: 0},
      holdCountDown: {type: Number, default: 0},
    }],


    holding: [
      {
        symbol: {type: String},
        amount: {type: Number},
        date: {type: Date},
      }
    ],

    usdcBorrow: {
        amount: {type: Number},
        interest: {type: Number, default: 0},
        collateral: {type: Number},
        collateralSymbol: {type: String},
        countDown: {type: Number, default: 0},
    },

    usdtBorrow: {
        amount: {type: Number},
        interest: {type: Number, default: 0},
        collateral: {type: Number},
        collateralSymbol: {type: String},
        countDown: {type: Number, default: 0},
    },

    oneMonth: [{type: Object, default: {}}],

    status: {
      type: Number,
      default: 1,
    }
  },
  { timestamps: true }
);

WalletSchema.plugin(uniqueValidator, { message: "is already taken." });
WalletSchema.plugin(mongoosePaginate);

var autoPopulate = function (next) {
  next();
};

WalletSchema.pre('findOne', autoPopulate);
WalletSchema.pre('find', autoPopulate);


WalletSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    assets: this.assets,
    borrow: this.borrow,
    status: this.status,
    isUSDCBorrowed: this.usdcBorrow.amount > 0 ? true : false,
    isUSDTBorrowed: this.usdtBorrow.amount > 0 ? true : false,
    holdCountDown: this.holdCountDown,
    usdcBorrow: this.usdcBorrow,
    usdtBorrow: this.usdtBorrow,
  }
}

module.exports = mongoose.model("Wallet", WalletSchema);
