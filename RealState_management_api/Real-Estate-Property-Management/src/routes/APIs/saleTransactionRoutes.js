
const express = require("express");
const router = express.Router();

const SaleTransactionController = require(
  "../../controllers/APIs/SaleTransactionControllers"
);

const {authMiddleware,authorizeRoles} = require(
  "../../middlewares/authMiddleware"
);



const Validation = require(
  "../../validations/validation"
);

const {
  createSaleTransactionSchema,
  saleTransactionIdParamsSchema,
  offerIdParamsSchema,
  updateSaleTransactionSchema,
} = require("../../validations/saleTransactionValidation");

// Create a transaction from an accepted offer
router.post(
  "/offer/:offerId",
  authMiddleware,
  authorizeRoles("owner", "agent"),
  Validation.validate(offerIdParamsSchema, "params"),
  Validation.validate(createSaleTransactionSchema),
  SaleTransactionController.createSaleTransaction
);

// Get logged-in user's transactions
router.get(
  "/my-transactions",
  authMiddleware,
  authorizeRoles("customer", "owner", "agent"),
  SaleTransactionController.getMySaleTransactions
);

// Get a single transaction
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("customer", "owner", "agent"),
  Validation.validate(saleTransactionIdParamsSchema, "params"),
  SaleTransactionController.getSaleTransactionById
);

// Update transaction and payment status
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("owner", "agent"),
  Validation.validate(saleTransactionIdParamsSchema, "params"),
  Validation.validate(updateSaleTransactionSchema),
  SaleTransactionController.updateSaleTransaction
);

// Admin — all transactions
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("admin"),
  SaleTransactionController.getAllSaleTransactionsAdmin
);

module.exports = router;