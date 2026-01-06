const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().required()
});

const orderSchema = Joi.object({
    product_id: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().min(1).max(100).required()
});

module.exports = {
    loginSchema,
    orderSchema
};