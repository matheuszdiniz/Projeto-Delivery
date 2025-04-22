const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Hamburguer = new Schema ({
    nome: {
        type: String,
        required: true
    },
    ingredientes: {
        type: Array,
        required: true
    },
    idIgrediente: {
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
    custoFinal: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        require: true
    }
})

mongoose.model('hamburguers', Hamburguer)