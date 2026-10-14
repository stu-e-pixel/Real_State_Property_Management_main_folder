
const mongoose = require("mongoose");

const SaleTransaction = require("../../models/saleTransaction");
const SaleOffer = require("../../models/saleOffer");
const Property = require("../../models/property");

const getActorId = (req) =>
  req.user?._id || req.user?.id;

const getRole = (req) =>
  String(req.user?.role || "").toLowerCase();

const isBuyer = (role) =>
  ["user", "customer", "buyer"].includes(role);

const isOwner = (role) => role === "owner";

const isAgent = (role) => role === "agent";

const getAgentId = (property) =>
  property.agentId?._id ||
  property.agentId ||
  property.agent?._id ||
  property.agent ||
  null;

const getSaleTransactionAggregation = (match = {}) => [
  { $match: match },

  {
    $lookup: {
      from: "properties",
      localField: "property",
      foreignField: "_id",
      as: "propertyDetails",
    },
  },
  {
    $unwind: {
      path: "$propertyDetails",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $lookup: {
      from: "users",
      localField: "buyer",
      foreignField: "_id",
      as: "buyerDetails",
    },
  },
  {
    $unwind: {
      path: "$buyerDetails",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $lookup: {
      from: "owners",
      localField: "owner",
      foreignField: "_id",
      as: "ownerDetails",
    },
  },
  {
    $unwind: {
      path: "$ownerDetails",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $lookup: {
      from: "agents",
      localField: "agent",
      foreignField: "_id",
      as: "agentDetails",
    },
  },
  {
    $unwind: {
      path: "$agentDetails",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $lookup: {
      from: "saleoffers",
      localField: "offer",
      foreignField: "_id",
      as: "offerDetails",
    },
  },
  {
    $unwind: {
      path: "$offerDetails",
      preserveNullAndEmptyArrays: true,
    },
  },

  { $sort: { createdAt: -1 } },
];

class SaleTransactionControllers{

async createSaleTransaction  (req, res)  {
  try {
    const actorId = getActorId(req);
    const role = getRole(req);
    const { offerId } = req.params;
    const { notes = "" } = req.body;

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      !isBuyer(role) &&
      !isOwner(role) &&
      !isAgent(role)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a transaction",
      });
    }

    if (!mongoose.isValidObjectId(offerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sale offer ID",
      });
    }

    const offer = await SaleOffer.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Sale offer not found",
      });
    }

    if (offer.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted sale offers can create transactions",
      });
    }

    const property = await Property.findById(offer.property);

    if (!property || property.purpose !== "Sale") {
      return res.status(404).json({
        success: false,
        message: "Sale property not found",
      });
    }

    const buyerId = offer.buyer;
    const ownerId =
      property.owner?._id ||
      property.owner ||
      offer.owner;

    const agentId = getAgentId(property);

    const authorized =
      (isBuyer(role) &&
        String(buyerId) === String(actorId)) ||
      (isOwner(role) &&
        String(ownerId) === String(actorId)) ||
      (isAgent(role) &&
        agentId &&
        String(agentId) === String(actorId));

        console.log({
  role,
  actorId: String(actorId),
  buyerId: String(buyerId),
  ownerId: String(ownerId),
  agentId: agentId ? String(agentId) : null,

  buyerMatch:
    isBuyer(role) &&
    String(buyerId) === String(actorId),

  ownerMatch:
    isOwner(role) &&
    String(ownerId) === String(actorId),

  agentMatch:
    isAgent(role) &&
    !!agentId &&
    String(agentId) === String(actorId),
});

    if (!authorized) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this sale",
      });
    }

    const existingTransaction =
      await SaleTransaction.findOne({ offer: offer._id });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,
        message: "A transaction already exists for this offer",
        data: existingTransaction,
      });
    }

    const transaction = await SaleTransaction.create({
      property: property._id,
      offer: offer._id,
      buyer: buyerId,
      owner: ownerId,
      agent: agentId,
      agreedPrice: offer.currentOfferPrice,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Sale transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A transaction already exists for this offer",
      });
    }

    console.error("Create Sale Transaction:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create sale transaction",
    });
  }
};

// Get transactions for the logged-in user
async getMySaleTransactions(req, res) {
  try {
    const actorId = getActorId(req);
    const role = getRole(req);

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const objectId = new mongoose.Types.ObjectId(String(actorId));

    // =====================================================
    // AGENT — show all transactions assigned to this agent
    // =====================================================
    if (isAgent(role)) {
      const transactions = await SaleTransaction.aggregate(
        getSaleTransactionAggregation({ agent: objectId })
      );

      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions,
      });
    }

    // =====================================================
    // BUYER — show all their own transactions
    // =====================================================
    if (isBuyer(role)) {
      const transactions = await SaleTransaction.aggregate(
        getSaleTransactionAggregation({ buyer: objectId })
      );

      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions,
      });
    }

    // =====================================================
    // OWNER — only transactions for their properties
    //          WITHOUT an assigned agent
    // =====================================================
    if (isOwner(role)) {
      const transactions = await SaleTransaction.aggregate([
        // 1. Owner's transactions
        { $match: { owner: objectId } },

        // 2. Lookup property first (source of truth for agentId)
        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyDetails",
          },
        },
        {
          $unwind: {
            path: "$propertyDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 3. ✅ Keep only properties with NO agent assigned
        {
          $match: {
            $or: [
              { "propertyDetails.agentId": null },
              { "propertyDetails.agentId": { $exists: false } },
            ],
          },
        },

        // 4. Populate buyer
        {
          $lookup: {
            from: "users",
            localField: "buyer",
            foreignField: "_id",
            as: "buyerDetails",
          },
        },
        {
          $unwind: {
            path: "$buyerDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 5. Populate owner
        {
          $lookup: {
            from: "owners",        // ⚠️ if owners stored in "users", change to "users"
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
          },
        },
        {
          $unwind: {
            path: "$ownerDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 6. Populate agent (will be null in this case, kept for consistency)
        {
          $lookup: {
            from: "agents",        // ⚠️ if agents stored in "users", change to "users"
            localField: "agent",
            foreignField: "_id",
            as: "agentDetails",
          },
        },
        {
          $unwind: {
            path: "$agentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 7. Populate the sale offer
        {
          $lookup: {
            from: "saleoffers",
            localField: "offer",
            foreignField: "_id",
            as: "offerDetails",
          },
        },
        {
          $unwind: {
            path: "$offerDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 8. Newest first
        { $sort: { createdAt: -1 } },
      ]);

      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions,
      });
    }

    // =====================================================
    // Unknown role
    // =====================================================
    return res.status(403).json({
      success: false,
      message: "You are not authorized to view transactions",
    });
  } catch (error) {
    console.error("Get My Sale Transactions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sale transactions",
    });
  }
}

// Get one transaction by ID
async getSaleTransactionById (req, res) {
  try {
    const actorId = getActorId(req);
    const role = getRole(req);
    const { id } = req.params;

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const transaction = await SaleTransaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Sale transaction not found",
      });
    }

    const property = await Property.findById(
      transaction.property
    );

    const actorIsParticipant =
      (isBuyer(role) &&
        String(transaction.buyer) === String(actorId)) ||
      (isOwner(role) &&
        String(transaction.owner) === String(actorId)) ||
      (isAgent(role) &&
        transaction.agent &&
        String(transaction.agent) === String(actorId));

    if (!actorIsParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this transaction",
      });
    }

    const [result] = await SaleTransaction.aggregate(
      getSaleTransactionAggregation({
        _id: transaction._id,
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        ...result,
        propertyExists: Boolean(property),
      },
    });
  } catch (error) {
    console.error("Get Sale Transaction:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sale transaction",
    });
  }
};

// Update transaction status and payment details
async updateSaleTransaction (req, res) {
  try {
    const actorId = getActorId(req);
    const role = getRole(req);
    const { id } = req.params;

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!isOwner(role) && !isAgent(role)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner or assigned agent can update this transaction",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const transaction = await SaleTransaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Sale transaction not found",
      });
    }

    const isAuthorized =
      (isOwner(role) &&
        String(transaction.owner) === String(actorId)) ||
      (isAgent(role) &&
        transaction.agent &&
        String(transaction.agent) === String(actorId));

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this transaction",
      });
    }

    if (
      ["completed", "cancelled"].includes(
        transaction.transactionStatus
      )
    ) {
      return res.status(409).json({
        success: false,
        message: "This transaction can no longer be updated",
      });
    }

    const {
      transactionStatus,
      paymentStatus,
      amountPaid,
      notes,
    } = req.body;

    const nextAmount =
      amountPaid !== undefined
        ? amountPaid
        : transaction.amountPaid;

    if (nextAmount > transaction.agreedPrice) {
      return res.status(400).json({
        success: false,
        message: "Amount paid cannot exceed the agreed price",
      });
    }

    const nextPaymentStatus =
      paymentStatus ||
      (nextAmount === 0
        ? "unpaid"
        : nextAmount >= transaction.agreedPrice
          ? "paid"
          : "partial");

    if (
      nextPaymentStatus === "paid" &&
      nextAmount < transaction.agreedPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Full payment is required for paid status",
      });
    }

    if (
      transactionStatus === "completed" &&
      nextAmount < transaction.agreedPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Full payment is required to complete the transaction",
      });
    }

    if (amountPaid !== undefined) {
      transaction.amountPaid = amountPaid;
      transaction.paymentStatus = nextPaymentStatus;
    } else if (paymentStatus !== undefined) {
      transaction.paymentStatus = paymentStatus;
    }

    if (notes !== undefined) {
      transaction.notes = notes;
    }

    if (transactionStatus !== undefined) {
      transaction.transactionStatus = transactionStatus;

      if (transactionStatus === "agreement_signed") {
        transaction.agreementDate = new Date();
      }

      if (transactionStatus === "completed") {
        transaction.paymentStatus = "paid";
        transaction.completedAt = new Date();
      }
    }

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Sale transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Update Sale Transaction:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN — view ALL sale transactions (no filter)
// =====================================================
async getAllSaleTransactionsAdmin(req, res) {
  try {
    const role = getRole(req);

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this endpoint",
      });
    }

    const transactions = await SaleTransaction.aggregate(
      getSaleTransactionAggregation({})
    );

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Get All Sale Transactions (Admin):", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sale transactions",
    });
  }
}

}

module.exports=new SaleTransactionControllers()
