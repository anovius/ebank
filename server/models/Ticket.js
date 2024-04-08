let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let TicketSchema = new mongoose.Schema(
  {
    subject:{
        type: String,
        required: true,
    },

    body:{
        type: String,
        required: true,
    },

    by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    status: {
      type: Number,
      default: 1,
    }
  },
  { timestamps: true }
);

TicketSchema.plugin(uniqueValidator, { message: "is already taken." });
TicketSchema.plugin(mongoosePaginate);

var autoPopulate = function (next) {
    this.populate("by");
    next();
};

TicketSchema.pre('findOne', autoPopulate);
TicketSchema.pre('find', autoPopulate);



TicketSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    subject: this.subject,
    body: this.body,
    by: this.by,
    status: this.status === 1 ? "Open" : "Closed",
  }
}

module.exports = mongoose.model("Ticket", TicketSchema);
