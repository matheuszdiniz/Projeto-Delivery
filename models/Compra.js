const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Compra = new Schema ({
    ingredientes: {
        type: Array,
        required: true
    },
    quantidade: {
        type: Array,
        required: true
    },
    custo: {
        type: Array,
        required: true
    },
    validade: {
        type: Array,
        required: true
    },
    compraTotal: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    }
})

mongoose.model('compras', Compra)