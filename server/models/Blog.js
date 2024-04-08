let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const slug = require("slug");
let BlogSchema = new mongoose.Schema(
  {
    slug:{
      type:String,
      unique:true,
      required:true
    },

    title:{
        type: String,
        required: true,
    },

    cover:{
        type: String,
        required: true,
    },

    body:{
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

BlogSchema.plugin(uniqueValidator, { message: "is already taken." });
BlogSchema.plugin(mongoosePaginate);

BlogSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});

BlogSchema.methods.slugify = function () {
  this.slug = slug(this.title + ((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

var autoPopulate = function (next) {
  next();
};

BlogSchema.pre('findOne', autoPopulate);
BlogSchema.pre('find', autoPopulate);



BlogSchema.methods.toJSON = function () {
  return {
    slug: this.slug,
    status: this.status,
    title: this.title,
    cover: this.cover,
    body: this.body,
  }
}

module.exports = mongoose.model("Blog", BlogSchema);
