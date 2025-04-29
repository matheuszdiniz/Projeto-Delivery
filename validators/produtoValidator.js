const Joi = require('joi');

const produtoSchema = Joi.object({
  descricao: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Descrição é obrigatória.',
    'string.min': 'Descrição precisa ter no mínimo 2 caracteres.',
    'string.max': 'Descrição deve ter no máximo 100 caracteres.'
  }),
  barcode: Joi.number().required().messages({
    'number.base': 'Código de barras deve ser um número.',
    'any.required': 'Código de barras é obrigatório.'
  }),
  apontamento: Joi.string().required().messages({
    'string.empty': 'Apontamento é obrigatório.'
  }),
  custo: Joi.string().required().messages({
    'string.empty': 'Custo é obrigatório.'
  }),
  estoque: Joi.string().required().messages({
    'string.empty': 'Estoque é obrigatório.'
  }),
  validade: Joi.string().required().messages({
    'string.empty': 'Validade é obrigatória.'
  }),
  id: Joi.optional()
});

module.exports = { produtoSchema };
