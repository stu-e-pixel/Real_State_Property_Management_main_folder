const Review = require("../../models/reviewModel");
const Property = require("../../models/property");
const Appointment = require("../../models/appointmentModel");
const mongoose = require("mongoose");
const {
  notifyAllAdmins,
  createNotification,
} = require("../../services/notificationService");

class ReviewControllers {
  // Create review:
  async createReview(req, res) {
    try {
      const { property, rating, comment } = req.body;

      const propertyData = await Property.findOne({
        _id: property,
        isDeleted: false,
      }).select("_id title agent owner status approvalStatus");

      if (!propertyData) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      if (propertyData.approvalStatus !== "Approved") {
        return res.status(400).json({
          success: false,
          message: "You can review only an approved property",
        });
      }

      const existingReview = await Review.findOne({
        property,
        user: req.user._id,
      });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          message: "You have already reviewed this property",
        });
      }

      const completedAppointment = await Appointment.findOne({
        property,
        user: req.user._id,
        status: "completed",
      });

      if (!completedAppointment) {
        return res.status(403).json({
          success: false,
          message:
            "You can review the property only after completing an appointment",
        });
      }

      const review = await Review.create({
        property,
        user: req.user._id,
        rating,
        comment,
      });

      await notifyAllAdmins({
        sender: req.user._id,
        type: "review_created",
        title: "New Review Pending",
        message: `A new review on "${propertyData.title}" requires moderation`,
        link: "/admin/allreview",
        refId: review._id,
        refModel: "Review",
      });

      return res.status(200).json({
        success: true,
        message: "Review completed successfully",
        review,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to create review",
        error: error.message,
      });
    }
  }

  // Admin - get all reviews:
  async getAllReviews(req, res) {
    try {
      const { status, rating, property } = req.query;

      const matchStage = {};

      if (status) {
        matchStage.status = status;
      }

      if (rating) {
        matchStage.rating = Number(rating);
      }

      if (property) {
        matchStage.property = property;
      }

      const reviews = await Review.aggregate([
        {
          $match: matchStage,
        },
        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyData",
          },
        },
        {
          $unwind: {
            path: "$propertyData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Hide sensitive user information:
        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            property: {
              _id: "$propertyData._id",
              title: "$propertyData.title,",
            },
            user: {
              _id: "$userData._id",
              name: "$userData.name",
              email: "$userData.email",
            },
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch reviews",
        error: error.message,
      });
    }
  }

  // Get review by id:
  async getReviewById(req, res) {
    try {
      const { id } = req.params;

      const reviews = await Review.aggregate([
        {
          $match: {
            _id: require("mongoose").Types.ObjectId.createFromHexString(id),
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyData",
          },
        },
        {
          $unwind: {
            path: "$propertyData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: "$userData._id",
              name: "$userData.name",
              email: "$userData.email",
            },
            property: {
              _id: "$propertyData._id",
              title: "$propertyData.title",
            },
          },
        },
      ]);

      if (!reviews.length) {
        return res.status(404).json({
          sucess: false,
          message: "Review not found",
        });
      }

      return res.status(200).json({
        success: true,
        review: reviews[0],
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch review",
        error: error.message,
      });
    }
  }

  // Get reviews of a property:
  async getPropertyReviews(req, res) {
    try {
      const { propertyId } = req.params;

      const property = await Property.findOne({
        _id: propertyId,
        isDeleted: false,
      }).select("_id title");

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      const reviews = await Review.aggregate([
        {
          $match: {
            property: property._id,
            status: "approved",
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },

        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            createdAt: 1,
            user: {
              _id: "#userData._id",
              name: "$userData.name",
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      const statistics = await Review.aggregate([
        {
          $match: {
            property: property._id,
            status: "approved",
          },
        },
        {
          $group: {
            _id: "$property",
            totalReviews: {
              $sum: 1,
            },
            averageRating: {
              $avg: "$rating",
            },
            highestTating: {
              $max: "$rating",
            },
            lowestRating: {
              $min: "$rating",
            },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        property: {
          _id: property._id,
          title: property.title,
        },
        statistics: statistics[0] || {
          totalReviews: 0,
          averageRating: 0,
          highestRating: 0,
          lowestRating: 0,
        },
        data: reviews,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch property reviews",
        error: error.message,
      });
    }
  }

  // Get my reviews:
  async getMyReviews(req, res) {
    try {
      const reviews = await Review.aggregate([
        {
          $match: {
            user: req.user._id,
          },
        },

        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyData",
          },
        },

        {
          $unwind: {
            path: "$propertyData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            property: {
              _id: "$propertyData._id",
              title: "$propertyData.title",
            },
          },
        },

        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch your reviews",
        error: error.message,
      });
    }
  }

  // Update review:
  async updateReview(req, res) {
    try {
      const { id, rating, comment } = req.body;

      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      // Only review owner can update:
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can update only your own review",
        });
      }

      if (review.status === "rejected") {
        return res.status(400).json({
          success: false,
          message: "Rejected review cannot be updated",
        });
      }

      const updateData = {};

      if (rating !== undefined) {
        updateData.rating = rating;
      }

      if (comment !== undefined) {
        updateData.comment = comment;
      }

      const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to update review",
        error: error.message,
      });
    }
  }

  // Delete review:
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      // Customer can delete own review
      // Admin can delete any review:
      if (
        req.user.role !== "admin" &&
        review.user.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can delete only your own review",
        });
      }

      await Review.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete review",
        error: error.message,
      });
    }
  }

  // Approve/reject review:
  async reviewAction(req, res) {
    try {
      const { id, action, reason } = req.body;

      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      // Approve:
      if (action === "approve") {
        review.status = "approved";
        review.reason = "";

        await review.save();

        return res.status(200).json({
          success: true,
          message: "Review approved successfully",
          review,
        });
      }

      // Reject:
      if (action === "reject") {
        review.status = "rejected";
        review.reason = reason || "";

        await review.save();

        await createNotification({
          recipient: review.user,
          recipientRole: "customer",
          sender: req.user._id,
          type: action === "approve" ? "review_approved" : "review_rejected",
          title:
            action === "approve"
              ? "Your Review Was Approved"
              : "Your Review Was Rejected",
          message:
            action === "approve"
              ? "Your review is now publicly visible"
              : `Your review was rejected: ${reason || "No reason provided"}`,
          link: "/user/reviews",
          refId: review._id,
          refModel: "Review",
        });

        return res.status(200).json({
          success: true,
          message: "Review rejected successfully",
          review,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Action must be approve or reject",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to process review action",
        error: error.message,
      });
    }
  }

  // Pending reviews:
  async getPendingReviews(req, res) {
    try {
      const reviews = await Review.aggregate([
        {
          $match: {
            status: "pending",
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },

        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyData",
          },
        },

        {
          $unwind: {
            path: "$propertyData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            status: 1,
            createdAt: 1,

            user: {
              _id: "$userData._id",
              name: "$userData.name",
              email: "$userData.email",
            },

            property: {
              _id: "$propertyData._id",
              title: "$propertyData.title",
            },
          },
        },

        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch pending reviews",
        error: error.message,
      });
    }
  }

  // =====================================================
  // OWNER — view reviews on their properties (no agent assigned)
  // =====================================================

  async getOwnerReviews(req, res) {
    try {
      const ownerId = req.user._id;
      const role = String(req.user.role || "").toLowerCase();

      if (role !== "owner") {
        return res.status(403).json({
          success: false,
          message: "Only owners can access this endpoint",
        });
      }

      console.log("🔍 GET OWNER REVIEWS — ownerId:", ownerId);

      const reviews = await Review.aggregate([
        // 1. Lookup the property for every review
        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyData",
          },
        },
        {
          $unwind: {
            path: "$propertyData",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 2. Filter — property owned by this owner AND no agent assigned
        {
          $match: {
            "propertyData.owner": new mongoose.Types.ObjectId(String(ownerId)),
            $or: [
              { "propertyData.agentId": null },
              { "propertyData.agentId": { $exists: false } },
            ],
            "propertyData.isDeleted": { $ne: true },
          },
        },

        // 3. Populate the review user (customer)
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 4. Reshape output
        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            status: 1,
            reason: 1,
            reply: 1,
            repliedAt: 1,
            repliedBy: 1,
            createdAt: 1,
            updatedAt: 1,

            property: {
              _id: "$propertyData._id",
              title: "$propertyData.title",
              propertyType: "$propertyData.propertyType",
              purpose: "$propertyData.purpose",
              images: "$propertyData.images",
            },

            user: {
              _id: "$userData._id",
              name: "$userData.name",
              email: "$userData.email",
              image: "$userData.image",
            },
          },
        },

        { $sort: { createdAt: -1 } },
      ]);

      console.log("✅ Found owner reviews:", reviews.length);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      console.error("Get Owner Reviews:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch owner reviews",
        error: error.message,
      });
    }
  }

  // =====================================================
  // AGENT — view reviews on assigned properties (agentId = this agent)
  // =====================================================

  async getAgentReviews(req, res) {
    try {
      const agentId = req.user._id;
      const role = String(req.user.role || "").toLowerCase();

      if (role !== "agent") {
        return res.status(403).json({
          success: false,
          message: "Only agents can access this endpoint",
        });
      }

      console.log("🔍 GET AGENT REVIEWS — agentId:", agentId);

      const reviews = await Review.aggregate([
        // 1. Lookup the property for every review
        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyData",
          },
        },
        {
          $unwind: {
            path: "$propertyData",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 2. Filter — property assigned to this agent
        {
          $match: {
            "propertyData.agentId": new mongoose.Types.ObjectId(
              String(agentId),
            ),
            "propertyData.isDeleted": { $ne: true },
          },
        },

        // 3. Populate the review user (customer)
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        // 4. Reshape output
        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            status: 1,
            reason: 1,
            reply: 1,
            repliedAt: 1,
            repliedBy: 1,
            createdAt: 1,
            updatedAt: 1,

            property: {
              _id: "$propertyData._id",
              title: "$propertyData.title",
              propertyType: "$propertyData.propertyType",
              purpose: "$propertyData.purpose",
              images: "$propertyData.images",
            },

            user: {
              _id: "$userData._id",
              name: "$userData.name",
              email: "$userData.email",
              image: "$userData.image",
            },
          },
        },

        { $sort: { createdAt: -1 } },
      ]);

      console.log("✅ Found agent reviews:", reviews.length);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      console.error("Get Agent Reviews:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch agent reviews",
        error: error.message,
      });
    }
  }

  // =====================================================
  // OWNER / AGENT — Reply to a review on their property
  // =====================================================

  async replyToReview(req, res) {
    try {
      const { id } = req.params;
      const { reply } = req.body;

      const actorId = req.user._id;
      const role = String(req.user.role || "").toLowerCase();

      if (!["owner", "agent"].includes(role)) {
        return res.status(403).json({
          success: false,
          message: "Only owners or agents can reply to reviews",
        });
      }

      if (!reply || !reply.trim()) {
        return res.status(400).json({
          success: false,
          message: "Reply is required",
        });
      }

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        });
      }

      // Fetch review + property
      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      const property = await Property.findById(review.property);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      const propertyOwnerId = String(property.owner?._id || property.owner);
      const propertyAgentId = property.agentId
        ? String(property.agentId?._id || property.agentId)
        : null;

      const isOwner = role === "owner" && propertyOwnerId === String(actorId);

      const isAssignedAgent =
        role === "agent" &&
        propertyAgentId !== null &&
        propertyAgentId === String(actorId);

      if (!isOwner && !isAssignedAgent) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to reply to this review",
        });
      }

      review.reply = reply.trim();
      review.repliedAt = new Date();
      review.repliedBy = actorId;

      await review.save();

      return res.status(200).json({
        success: true,
        message: "Reply added successfully",
        review,
      });
    } catch (error) {
      console.error("Reply to Review:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to add reply",
        error: error.message,
      });
    }
  }

  // =====================================================
  // OWNER / AGENT — Approve or reject a review
  // =====================================================

  async updateReviewStatusByOwner(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const actorId = req.user._id;
      const role = String(req.user.role || "").toLowerCase();

      if (!["owner", "agent"].includes(role)) {
        return res.status(403).json({
          success: false,
          message: "Only owners or agents can update review status",
        });
      }

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be approved or rejected",
        });
      }

      if (status === "rejected" && (!reason || !reason.trim())) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        });
      }

      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      const property = await Property.findById(review.property);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      const propertyOwnerId = String(property.owner?._id || property.owner);
      const propertyAgentId = property.agentId
        ? String(property.agentId?._id || property.agentId)
        : null;

      // Owner handles when agentId is null
      const isOwner = role === "owner" && propertyOwnerId === String(actorId);

      // Agent handles when agentId matches
      const isAssignedAgent =
        role === "agent" &&
        propertyAgentId !== null &&
        propertyAgentId === String(actorId);

      if (!isOwner && !isAssignedAgent) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this review status",
        });
      }

      review.status = status;

      if (status === "rejected") {
        review.reason = reason.trim();
      } else {
        review.reason = "";
      }

      await review.save();

      return res.status(200).json({
        success: true,
        message:
          status === "approved"
            ? "Review approved successfully"
            : "Review rejected successfully",
        review,
      });
    } catch (error) {
      console.error("Update Review Status By Owner:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update review status",
        error: error.message,
      });
    }
  }
}

module.exports = new ReviewControllers();
