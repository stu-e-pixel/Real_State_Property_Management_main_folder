const mongoose = require("mongoose");

const SaleOffer = require("../../models/saleOffer");
const Property = require("../../models/property");
const { notifySaleOfferAction } = require("../../services/notificationService");

const getActorModel = (role) => {
  const models = {
    user: "User",
    customer: "User",
    buyer: "User",
    owner: "Owner",
    agent: "Agent",
  };

  return models[String(role || "").toLowerCase()] || null;
};

const getActorId = (req) => req.user?._id || req.user?.id;

const isBuyer = (role) =>
  ["customer"].includes(String(role || "").toLowerCase());

const isOwner = (role) => String(role || "").toLowerCase() === "owner";

const isAgent = (role) => String(role || "").toLowerCase() === "agent";

const getSaleOfferAggregation = (match) => [
  { $match: match },
  {
    $lookup: {
      from: "properties",
      localField: "property",
      foreignField: "_id",
      as: "property",
    },
  },
  {
    $unwind: {
      path: "$property",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "buyer",
      foreignField: "_id",
      as: "buyer",
    },
  },
  {
    $unwind: {
      path: "$buyer",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "owners",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  },
  {
    $unwind: {
      path: "$owner",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "agents",
      localField: "agent",
      foreignField: "_id",
      as: "agent",
    },
  },
  {
    $unwind: {
      path: "$agent",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $sort: { createdAt: -1 },
  },
];

class SaleOfferControllers {
  async createSaleOffer(req, res) {
    try {
      const buyerId = getActorId(req);

      if (!buyerId || !isBuyer(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Only buyers can create sale offers",
        });
      }

      const { propertyId, offerPrice, message = "" } = req.body;

      if (!mongoose.isValidObjectId(buyerId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid authenticated user",
        });
      }

      const property = await Property.findOne({
        _id: propertyId,
        purpose: "Sale",
        approvalStatus: "Approved",
        isDeleted: false,
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Approved sale property not found",
        });
      }

      const ownerId = property.owner?._id || property.owner;

      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: "Property owner is missing",
        });
      }

      if (String(ownerId) === String(buyerId)) {
        return res.status(400).json({
          success: false,
          message: "You cannot make an offer on your own property",
        });
      }

      if (
        property.availabilityStatus &&
        property.availabilityStatus !== "available"
      ) {
        return res.status(409).json({
          success: false,
          message: "This property is not available for offers",
        });
      }

      const existingOffer = await SaleOffer.findOne({
        property: property._id,
        buyer: buyerId,
        status: { $in: ["pending", "countered", "accepted"] },
      });

      if (existingOffer) {
        return res.status(409).json({
          success: false,
          message:
            "You already have an active or accepted offer for this property",
        });
      }

      const saleOffer = await SaleOffer.create({
        property: property._id,
        buyer: buyerId,
        owner: ownerId,
        agent: property.agentId || null,
        offerPrice,
        currentOfferPrice: offerPrice,
        message,
      });

      return res.status(201).json({
        success: true,
        message: "Sale offer submitted successfully",
        data: saleOffer,
      });
    } catch (error) {
      console.error("Create Sale Offer:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create sale offer",
      });
    }
  }

  // 2. Buyer views their own offers
  async getMySaleOffers(req, res) {
    try {
      const buyerId = getActorId(req);

      if (!buyerId || !isBuyer(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Only buyers can view their offers",
        });
      }

      const offers = await SaleOffer.aggregate(
        getSaleOfferAggregation({
          buyer: new mongoose.Types.ObjectId(String(buyerId)),
        }),
      );

      return res.status(200).json({
        success: true,
        count: offers.length,
        data: offers,
      });
    } catch (error) {
      console.error("Get My Sale Offers:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch sale offers",
      });
    }
  }

  // 3. Owner or assigned agent views offers for a property

  async getPropertySaleOffers(req, res) {
    try {
      const actorId = getActorId(req);
      const role = String(req.user?.role || "").toLowerCase();
      const { propertyId } = req.params;

      // 1. Check authentication
      if (!actorId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // 2. Only owners and agents can access property offers
      if (!isOwner(role) && !isAgent(role)) {
        return res.status(403).json({
          success: false,
          message: "Only owners or agents can view property offers",
        });
      }

      // 3. Find the sale property
      const property = await Property.findOne({
        _id: propertyId,
        purpose: "Sale",
        isDeleted: false,
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Sale property not found",
        });
      }

      // 4. Get owner ID
      const ownerId = property.owner?._id || property.owner;

      // 5. Get assigned agent ID
      const assignedAgentId = property.agentId?._id || property.agentId || null;

      // 6. Owner can view offers ONLY if no agent is assigned
      const ownerAuthorized =
        isOwner(role) &&
        String(ownerId) === String(actorId) &&
        !assignedAgentId;

      // 7. Agent can view offers ONLY for their assigned property
      const agentAuthorized =
        isAgent(role) &&
        assignedAgentId !== null &&
        String(assignedAgentId) === String(actorId);

      console.log("Sale Offer Authorization Debug:", {
        role,
        actorId: String(actorId),
        propertyId: String(property._id),
        ownerId: String(property.owner?._id || property.owner),
        assignedAgentId: property.agentId
          ? String(property.agentId?._id || property.agentId)
          : null,
        ownerAuthorized,
        agentAuthorized,
      });

      // 8. Check authorization
      if (!ownerAuthorized && !agentAuthorized) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view these offers",
        });
      }

      // 9. Get sale offers using aggregation
      const offers = await SaleOffer.aggregate(
        getSaleOfferAggregation({
          property: property._id,
        }),
      );

      // 10. Return response
      return res.status(200).json({
        success: true,
        count: offers.length,
        data: offers,
      });
    } catch (error) {
      console.error("Get Property Sale Offers:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch property offers",
      });
    }
  }

  // 4. Owner/agent responds to an offer;
  // buyer may accept or reject a counteroffer.
  async respondToSaleOffer(req, res) {
    try {
      const actorId = getActorId(req);
      const role = String(req.user.role || "").toLowerCase();
      const { id } = req.params;
      const { action, counterOfferPrice, message = "" } = req.body;

      if (!actorId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const offer = await SaleOffer.findById(id);

      if (!offer) {
        return res.status(404).json({
          success: false,
          message: "Sale offer not found",
        });
      }

      const property = await Property.findById(offer.property);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      const ownerId = property.owner?._id || property.owner;
      const assignedAgentId = property.agentId?._id || property.agentId;

      const buyerResponding =
        isBuyer(role) && String(offer.buyer) === String(actorId);

      const ownerResponding =
        isOwner(role) && String(ownerId) === String(actorId);

      const agentResponding =
        isAgent(role) && String(assignedAgentId) === String(actorId);

      if (!buyerResponding && !ownerResponding && !agentResponding) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to respond to this offer",
        });
      }

      if (buyerResponding) {
        if (
          offer.status !== "countered" ||
          !["accept", "reject"].includes(action)
        ) {
          return res.status(400).json({
            success: false,
            message: "Buyers can only accept or reject a pending counteroffer",
          });
        }
      } else if (!["pending", "countered"].includes(offer.status)) {
        return res.status(409).json({
          success: false,
          message: "This offer can no longer be changed",
        });
      }

      if (action === "counter") {
        if (buyerResponding) {
          return res.status(403).json({
            success: false,
            message: "Only the owner or assigned agent can counter",
          });
        }

        offer.offerHistory.push({
          offeredBy: actorId,
          offeredByModel: getActorModel(role),
          amount: counterOfferPrice,
          message,
        });

        offer.currentOfferPrice = counterOfferPrice;
        offer.status = "countered";
        offer.respondedAt = new Date();
      } else if (action === "accept") {
        offer.status = "accepted";
        offer.respondedAt = new Date();
      } else if (action === "reject") {
        offer.status = "rejected";
        offer.respondedAt = new Date();
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid offer action",
        });
      }

      await offer.save();

      await notifySaleOfferAction({
  offer,
  property,
  senderUser: req.user,
  action,
});

      return res.status(200).json({
        success: true,
        message: `Offer ${action}ed successfully`,
        data: offer,
      });
    } catch (error) {
      console.error("Respond to Sale Offer:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to respond to sale offer",
      });
    }
  }

  // 5. Buyer withdraws their offer
  async withdrawSaleOffer(req, res) {
    try {
      const buyerId = getActorId(req);

      if (!buyerId || !isBuyer(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Only buyers can withdraw offers",
        });
      }

      const offer = await SaleOffer.findOne({
        _id: req.params.id,
        buyer: buyerId,
      });

      if (!offer) {
        return res.status(404).json({
          success: false,
          message: "Sale offer not found",
        });
      }

      if (!["pending", "countered"].includes(offer.status)) {
        return res.status(409).json({
          success: false,
          message: "This offer can no longer be withdrawn",
        });
      }

      offer.status = "withdrawn";
      offer.respondedAt = new Date();

      await offer.save();

      return res.status(200).json({
        success: true,
        message: "Sale offer withdrawn successfully",
        data: offer,
      });
    } catch (error) {
      console.error("Withdraw Sale Offer:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to withdraw sale offer",
      });
    }
  }

  // 6. Buyer deletes their own sale offer
  async deleteSaleOffer(req, res) {
    try {
      const buyerId = getActorId(req);
      const { id } = req.params;

      if (!buyerId || !isBuyer(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Only buyers can delete their own offers",
        });
      }

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sale offer ID",
        });
      }

      const saleOffer = await SaleOffer.findOne({
        _id: id,
        buyer: buyerId,
      });

      if (!saleOffer) {
        return res.status(404).json({
          success: false,
          message: "Sale offer not found or you are not authorized",
        });
      }

      if (
        !["pending", "countered", "rejected", "withdrawn", "expired"].includes(
          saleOffer.status,
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Accepted sale offers cannot be deleted",
        });
      }

      await SaleOffer.findByIdAndDelete(saleOffer._id);

      return res.status(200).json({
        success: true,
        message: "Sale offer deleted successfully",
      });
    } catch (error) {
      console.error("Delete Sale Offer:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete sale offer",
      });
    }
  }

  // =====================================================
// Owner — view all sale offers on their properties
// =====================================================

async getSaleOfferByOwner(req, res) {
  try {
    const ownerId = getActorId(req);
    const role = String(req.user?.role || "").toLowerCase();

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!isOwner(role)) {
      return res.status(403).json({
        success: false,
        message: "Only owners can access this endpoint",
      });
    }

    // Fetch all offers where the offer.owner === logged-in owner
    // AND the property has NO agent assigned (owner handles them)
    const offers = await SaleOffer.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(String(ownerId)),
        },
      },

      // Populate property
      {
        $lookup: {
          from: "properties",
          localField: "property",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $unwind: {
          path: "$property",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ Only properties WITHOUT assigned agent
      {
        $match: {
          $or: [
            { "property.agentId": null },
            { "property.agentId": { $exists: false } },
          ],
        },
      },

      // Populate buyer
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: {
          path: "$buyer",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Populate owner
      {
        $lookup: {
          from: "owners",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Sort newest first
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error("Get Sale Offers By Owner:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sale offers",
    });
  }
}

// =====================================================
// Agent — view all sale offers on their assigned properties
// =====================================================

async getSaleOfferByAgent(req, res) {
  try {
    const agentId = getActorId(req);
    const role = String(req.user?.role || "").toLowerCase();

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!isAgent(role)) {
      return res.status(403).json({
        success: false,
        message: "Only agents can access this endpoint",
      });
    }

    console.log("🔍 GET AGENT OFFERS — agentId:", agentId);

    const offers = await SaleOffer.aggregate([
      // ✅ Lookup property FIRST
      {
        $lookup: {
          from: "properties",
          localField: "property",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $unwind: {
          path: "$property",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ Match ONLY by property.agentId — single source of truth
      {
        $match: {
          "property.agentId": new mongoose.Types.ObjectId(String(agentId)),
        },
      },

      // Populate buyer
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: { path: "$buyer", preserveNullAndEmptyArrays: true },
      },

      // Populate owner
      {
        $lookup: {
          from: "users",   // ⚠️ change to "owners" if separate collection
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
      },

      // Populate agent
      {
        $lookup: {
          from: "users",   // ⚠️ change to "agents" if separate collection
          localField: "agent",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: { path: "$agent", preserveNullAndEmptyArrays: true },
      },

      { $sort: { createdAt: -1 } },
    ]);

    console.log("✅ Found offers:", offers.length);

    return res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error("Get Sale Offers By Agent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sale offers",
    });
  }
}


}

module.exports = new SaleOfferControllers();
