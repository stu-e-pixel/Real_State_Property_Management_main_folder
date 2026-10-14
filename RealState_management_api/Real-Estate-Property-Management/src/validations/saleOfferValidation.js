const Joi = require("joi");

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createSaleOfferSchema = Joi.object({
  propertyId: objectId.required(),
  offerPrice: Joi.number().positive().required(),
  message: Joi.string().trim().max(2000).allow("").default(""),
});

const saleOfferIdParamsSchema = Joi.object({
  id: objectId.required(),
});

const propertyOfferParamsSchema = Joi.object({
  propertyId: objectId.required(),
});

const respondToSaleOfferSchema = Joi.object({
  action: Joi.string().valid("accept", "reject", "counter").required(),
  counterOfferPrice: Joi.when("action", {
    is: "counter",
    then: Joi.number().positive().required(),
    otherwise: Joi.forbidden(),
  }),
  message: Joi.string().trim().max(2000).allow("").default(""),
});

module.exports = {
  createSaleOfferSchema,
  saleOfferIdParamsSchema,
  propertyOfferParamsSchema,
  respondToSaleOfferSchema,
};