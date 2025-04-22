const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Produto = new Schema ({
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
    data: {
        type: String,
        required: true
    },
    validade: {
        type: String,
        required: true
    }
})

mongoose.model('produtos', Produto)