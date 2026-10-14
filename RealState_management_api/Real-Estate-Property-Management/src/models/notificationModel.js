const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: ["admin", "owner", "agent", "customer"],
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "inquiry_created",
        "inquiry_replied",
        "appointment_created",
        "appointment_confirmed",
        "appointment_rejected",
        "appointment_rescheduled",
        "appointment_cancelled",
        "rental_created",
        "rental_approved",
        "rental_rejected",
        "lease_created",
        "lease_terminated",
        "lease_expiring",
        "sale_offer_created",
        "sale_offer_countered",
        "sale_offer_accepted",
        "sale_offer_rejected",
        "transaction_created",
        "transaction_updated",
        "review_created",
        "review_approved",
        "review_rejected",
        "property_approved",
        "property_rejected",
        "system",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    link: {
      type: String,
      default: "",
    },

    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    refModel: {
      type: String,
      enum: [
        "Inquiry",
        "Appointment",
        "RentalApplication",
        "Lease",
        "SaleOffer",
        "SaleTransaction",
        "Review",
        "Property",
        null,
      ],
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for fast queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);