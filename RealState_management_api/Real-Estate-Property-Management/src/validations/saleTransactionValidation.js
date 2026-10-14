
const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid MongoDB ID",
  });

const createSaleTransactionSchema = Joi.object({
  notes: Joi.string()
    .trim()
    .max(2000)
    .allow("")
    .default(""),
});

const saleTransactionIdParamsSchema = Joi.object({
  id: objectId.required(),
});

const offerIdParamsSchema = Joi.object({
  offerId: objectId.required(),
});

const updateSaleTransactionSchema = Joi.object({
  transactionStatus: Joi.string().valid(
    "agreement_signed",
    "payment_pending",
    "completed",
    "cancelled"
  ),

  paymentStatus: Joi.string().valid(
    "unpaid",
    "partial",
    "paid"
  ),

  amountPaid: Joi.number().min(0),

  notes: Joi.string().trim().max(2000).allow(""),
})
  .min(1)
  .unknown(false);

module.exports = {
  createSaleTransactionSchema,
  saleTransactionIdParamsSchema,
  offerIdParamsSchema,
  updateSaleTransactionSchema,
};