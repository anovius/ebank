let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let PriceSchema = new mongoose.Schema(
  {
    assets: {}
  },
  { timestamps: true }
);

PriceSchema.plugin(uniqueValidator, { message: "is already taken." });
PriceSchema.plugin(mongoosePaginate);

var autoPopulate = function (next) {
  next();
};

PriceSchema.pre('findOne', autoPopulate);
PriceSchema.pre('find', autoPopulate);



PriceSchema.methods.toJSON = function () {
  return {
    assets: this.assets
  }
}

module.exports = mongoose.model("Prices", PriceSchema);
