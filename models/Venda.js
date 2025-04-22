const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Venda = new Schema ({
    cliente: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    produto: {
        type: Array,
        required: true
    },
    quantidade: {
        type: Array,
        required: true
    },
    custoVenda: {
        type: Number,
        required: true
    },
    taxa: {
        type: Number,
        required: true
    },
    venda: {
        type: Number,
        required: true
    },
    markup: {
        type: Number,
        required: true
    },
    margem: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    },
})

mongoose.model('vendas', Venda)