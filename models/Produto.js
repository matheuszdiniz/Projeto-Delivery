const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProdutoSchema = new Schema({
    descricao: {
        type: String,
        required: true
    },
    barcode: {
        type: Number,
        required: true
    },
    apontamento: {
        type: String,
        required: true
    },
    custo: {
        type: String,
        required: true
    },
    estoque: {
        type: String,
        required: true
    },
    dataCadastro: {
        type: String,
        required: true
    },
    validade: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('produtos', ProdutoSchema);