
const mongoose = require("mongoose");

const saleTransactionSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property",
      required: true,
      index: true,
    },

    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaleOffer",
      required: true,
      unique: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },

    agreedPrice: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    transactionStatus: {
      type: String,
      enum: [
        "initiated",
        "agreement_signed",
        "payment_pending",
        "completed",
        "cancelled",
      ],
      default: "initiated",
      index: true,
    },

    agreementDate: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  { timestamps: true }
);

saleTransactionSchema.index({
  buyer: 1,
  transactionStatus: 1,
});

saleTransactionSchema.index({
  owner: 1,
  transactionStatus: 1,
});

module.exports = mongoose.model(
  "SaleTransaction",
  saleTransactionSchema
);