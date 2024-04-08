let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let ConfigSchema = new mongoose.Schema(
  {
    referralReward: Number,
    tenUsersReward: Number,
  },
  { timestamps: true }
);

ConfigSchema.plugin(uniqueValidator, { message: "is already taken." });
ConfigSchema.plugin(mongoosePaginate);

var autoPopulate = function (next) {
  next();
};

ConfigSchema.pre('findOne', autoPopulate);
ConfigSchema.pre('find', autoPopulate);

ConfigSchema.methods.toJSON = function () {
  return {
    referralReward: this.referralReward,
    tenUsersReward: this.tenUsersReward,
  }
}

module.exports = mongoose.model("Config", ConfigSchema);
