const Joi = require('joi');

const pratoSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Nome é obrigatório.',
    'string.min': 'Nome deve ter no mínimo 2 caracteres.',
    'string.max': 'Nome deve ter no máximo 100 caracteres.',
  }),
  ingredientes: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).required().messages({
    'any.required': 'Ingredientes são obrigatórios.',
  }),
  qtdIngrediente: Joi.alternatives().try(Joi.array(), Joi.string()).required(),
  custoIngrediente: Joi.alternatives().try(Joi.array(), Joi.string()).required(),
  custoFinal: Joi.string().required(),
  valorPrato: Joi.string().required(),
  markupPrato: Joi.string().required(),
  margemPrato: Joi.string().required(),
  id: Joi.optional()
});

module.exports = {
  pratoSchema,
};
