const Joi = require('joi');

const vendaSchema = Joi.object({
    cliente: Joi.string().required(),
    endereco: Joi.string().required(),
    produtos: Joi.array().items(Joi.string()).required(),
    quantidade: Joi.array().items(Joi.number().integer().min(1)).required(),
    custoVenda: Joi.number().required(),
    taxa: Joi.number().min(0).required(),
    venda: Joi.number().required(),
    markup: Joi.number().required(),
    margem: Joi.number().required(),
    data: Joi.string().required()
});

module.exports = {
    vendaSchema
};