const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PratoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  ingredientes: {
    type: [String],
    required: true
  },
  idIngrediente: {
    type: [String],
    required: true
  },
  qtdIngrediente: {
    type: [Number],
    required: true
  },
  custoIngrediente: {
    type: [Number],
    required: true
  },
  valorPrato: {
    type: Number,
    required: true
  },
  markupPrato: {
    type: Number,
    required: true
  },
  margemPrato: {
    type: Number,
    required: true
  },
  custoFinal: {
    type: Number,
    required: true
  },
  data: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('pratos', PratoSchema);