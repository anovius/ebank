let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let TransactionSchema = new mongoose.Schema(
  {
    type:{
        type: Number,
        required: true, // 1 - deposit, 2 - withdrawal, 3-Hold, 4-Redeem, 5-Borrow, 6-Repay, 7-Reward, 8-Referral, 9-Referral Bonus
    },

    asset:{
        type: String,
        required: true,
    },

    amount:{
        type: Number,
        required: true,
    },

    by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    hash:{
        type: String,
        default: "",
    },

    address: {
        type: String,
        default: "",
    },

    screenshot:{
        type: String,
        default: "",
    },

    status: {
      type: Number,
      default: 0, // 0 - pending, 1 - completed, 2 - failed
    }
  },
  { timestamps: true }
);

TransactionSchema.plugin(uniqueValidator, { message: "is already taken." });
TransactionSchema.plugin(mongoosePaginate);

var autoPopulate = function (next) {
  this.populate("by");
  next();
};

TransactionSchema.pre('findOne', autoPopulate);
TransactionSchema.pre('find', autoPopulate);

TransactionSchema.methods.getType = function () {
  if(this.type === 1) return "Deposit";
  if(this.type === 2) return "Withdrawal";
  if(this.type === 3) return "Hold";
  if(this.type === 4) return "Redeem";
  if(this.type === 5) return "Borrow";
  if(this.type === 6) return "Repay";
  if(this.type === 7) return "Reward";
  if(this.type === 8) return "Referral";
  if(this.type === 9) return "Referral Bonus";
}

TransactionSchema.methods.getStatus = function () {
  if(this.status === 0) return "Pending";
  if(this.status === 1) return "Completed";
  if(this.status === 2) return "Failed";
}

TransactionSchema.methods.toJSON = function () {
  return {
    id: this._id,
    status: this.getStatus(),
    type: this.getType(),
    asset: this.asset,
    by: this.by,
    amount: this.amount,
    hash: this.hash,
    address: this.address,
    screenshot: this.screenshot,
    time: this.createdAt,
  }
}

module.exports = mongoose.model("Transaction", TransactionSchema);
