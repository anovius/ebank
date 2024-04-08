let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
let secret = require("../config").secret;
const slug = require("slug");


let faker = require("faker");
const mongoosePaginate = require("mongoose-paginate-v2");
const { isNull } = require("util");
let UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    hash: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
      required: true,
    },

    name:{
      type: String,
      default: "App User",
    },

    dob:{
      type: Date,   
    },

    age:{
      type: Number,
    },

    country: {
      type: String,
      default: "USA",
    },

    language: {
      type: String,
      default: "English",
    }, 

    currency: {
      type: String,
      default: "USD",
    },

    otp: {
      type: Number,
      default: null,
    },

    otpExpires: {
      type: Number,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    wallet:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },

    kycKey: {
      type: String,
      default: "null",
    },

    kycLevel: {
      type: Number,
      default: 0
    },

    role: {
      type: Number,
      default: 1,
    },

    status: {
      type: Number,
      default: 0,
    },

    //referral work

    referralCode: {
      type: String,
      unique: true,
      default: "",
    },

    refereedBy: {
      type: String,
      default: "",
    },

    referralUsedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    referralCounter: {
      type: Number,
      default: 0,
    },


  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);

UserSchema.pre("validate", function (next) {
  if (!this.referralCode) {
    this.slugify();
  }
  next();
});

UserSchema.methods.slugify = function () {
  this.referralCode = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

UserSchema.methods.validPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};
UserSchema.methods.setOTP = function () {
  this.otp = faker.random.number({ max: 9999, min: 999 });
  this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

var autoPopulate = function (next) {
  this.populate("wallet");
  this.populate("referralUsedBy");
  next();
};

UserSchema.pre('findOne', autoPopulate);
UserSchema.pre('find', autoPopulate);

UserSchema.methods.getKarmaLevel = function () {
  let index = this.wallet.assets.findIndex(asset => asset.symbol === "EBCT");
  if (index === -1) {
    return {level: 1, amount: 0};
  }
  
  let amount = this.wallet.assets[index].holding;
  
  if(amount >= 1 && amount < 49999){
    return {level: 1, amount: amount};
  }
  else if(amount >= 50000 && amount < 199999){
      return {level: 2, amount: amount};
  }
  else if(amount >= 200000 && amount <= 1000000){
      return {level: 3, amount: amount};
  }
  else if(amount > 1000000){
      return {level: 4, amount: amount};
  }
  else{
    return {level: 1, amount: 0};
  }
}


UserSchema.methods.toJSON = function () {
  return {
    email: this.email,
    name: this.name,
    country: this.country,
    language: this.language,
    currency: this.currency,
    referralUsedBy: this.referralUsedBy,
    status: this.status,
  }
}

UserSchema.methods.toAuthJSON = function () {

  return {
    token: this.generateJWT(),
    email: this.email,
    name: this.name,
    country: this.country,
    language: this.language,
    currency: this.currency,
    wallet: this.wallet,
    kycLevel: this.kycLevel,
    role: this.role,
    referralCode: this.referralCode,
  }

};

module.exports = mongoose.model("User", UserSchema);
