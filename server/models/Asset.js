let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let AssetSchema = new mongoose.Schema(
  {
    icon:{
            type: String,
            required: true,
    },

    name:{
        type: String,
        required: true,
    },

    full: {
        type: String,
        required: true,
    },

    min: {
        type: Number,
        required: true,
    },

    max: {
        type: Number,
        required: true,
    },

    conversion: {
        type: Number,
        required: true,
    },

    percentageCharge: {
        type: Number,
        required: true,
    },

    fixCharge: {
        type: Number,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    karmaOne: {
        type: Number,
    },

    karmaTwo: {
        type: Number,
    },

    karmaThree: {
        type: Number,
    },

    karmaFour: {
        type: Number,
    },

    interestOne: Number,
    interestTwo: Number,
    interestThree: Number,
    interestFour: Number,

    walletAddress: {
        type: String
    },

    stats: {
        type: Number,
        default: 0,
    },
    

    status: {
        type: Number,
        default: 1, // 1 - Active, 2 - Blocked
    },

  },
  { timestamps: true }
);

AssetSchema.plugin(uniqueValidator, { message: "is already taken." });
AssetSchema.plugin(mongoosePaginate);

var autoPopulate = function (next) {
  next();
};

AssetSchema.pre('findOne', autoPopulate);
AssetSchema.pre('find', autoPopulate);


AssetSchema.methods.toJSON = function () {
  return {
    id: this._id,
    icon: this.icon,
    name: this.name,
    full: this.full,
    min: this.min,
    max: this.max,
    conversion: this.conversion,
    percentageCharge: this.percentageCharge,
    fixCharge: this.fixCharge,
    address: this.address,
    status: this.status,
    karmaOne: this.karmaOne,
    karmaTwo: this.karmaTwo,
    karmaThree: this.karmaThree,
    stats: this.stats,
    karmaFour: this.karmaFour,
    walletAddress: this.walletAddress,
    interestOne: this.interestOne,
    interestTwo: this.interestTwo,
    interestThree: this.interestThree,
    interestFour: this.interestFour,
  }
}

module.exports = mongoose.model("Asset", AssetSchema);
