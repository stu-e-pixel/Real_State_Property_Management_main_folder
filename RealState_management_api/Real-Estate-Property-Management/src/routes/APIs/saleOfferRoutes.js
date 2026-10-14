
const express = require("express");
const router = express.Router();

const SaleOfferController = require("../../controllers/APIs/SaleOfferControllers");
const {authMiddleware,authorizeRoles} = require("../../middlewares/authMiddleware");

const {
  createSaleOfferSchema,
  saleOfferIdParamsSchema,
  propertyOfferParamsSchema,
  respondToSaleOfferSchema,
} = require("../../validations/saleOfferValidation");
const Validation = require("../../validations/validation");

// Buyer submits a new offer
router.post(
  "/createSale",
  authMiddleware,
  authorizeRoles("customer"),
  Validation.validate(createSaleOfferSchema),
  SaleOfferController.createSaleOffer
);

// Buyer views their offers
router.get(
  "/my-offers",
  authMiddleware,
  authorizeRoles("customer"),
  SaleOfferController.getMySaleOffers
);

// Owner — view all sale offers on their properties
router.get(
  "/owner/my-offers",
  authMiddleware,
  authorizeRoles("owner"),
  SaleOfferController.getSaleOfferByOwner
);

// Agent — view all sale offers on their assigned properties
router.get(
  "/agent/my-offers",
  authMiddleware,
  authorizeRoles("agent"),
  SaleOfferController.getSaleOfferByAgent
);

// Owner or assigned agent views offers for a property
router.get(
  "/property/:propertyId",
  authMiddleware,
  authorizeRoles("owner", "agent"),
  Validation.validate(propertyOfferParamsSchema),
  SaleOfferController.getPropertySaleOffers
);

// Owner/agent responds; buyer can accept or reject a counteroffer
router.patch(
  "/:id/respond",
  authMiddleware,
  authorizeRoles( "owner", "agent","customer"),
  Validation.validate(saleOfferIdParamsSchema,"params"),
  Validation.validate(respondToSaleOfferSchema),
  SaleOfferController.respondToSaleOffer
);

// Buyer withdraws their offer
router.patch(
  "/:id/withdraw",
  authMiddleware,
  authorizeRoles("customer"),
  Validation.validate(saleOfferIdParamsSchema),
  SaleOfferController.withdrawSaleOffer
);

// Delete own sale offer
router.delete(
  "/:id",
  authMiddleware,
  Validation.validate(saleOfferIdParamsSchema),
  SaleOfferController.deleteSaleOffer
);

module.exports = router;
