const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  location: Joi.string().required(),
  price: Joi.number().required().min(0),
  description: Joi.string().required(),
});
