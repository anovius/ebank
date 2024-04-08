let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let TeamSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },

    img: {
        type: String,
        required: true,
    },

    designation: {
        type: String,
        required: true,
    },

    status: {
      type: Number,
      default: 1,
    }
  },
  { timestamps: true }
);

TeamSchema.plugin(uniqueValidator, { message: "is already taken." });
TeamSchema.plugin(mongoosePaginate);

var autoPopulate = function (next) {
  next();
};

TeamSchema.pre('findOne', autoPopulate);
TeamSchema.pre('find', autoPopulate);



TeamSchema.methods.toJSON = function () {
  return {
    name: this.name,
    img: this.img,
    designation: this.designation,
  }
}

module.exports = mongoose.model("Team", TeamSchema);
