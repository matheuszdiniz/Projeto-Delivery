const handlebars = require("express-handlebars");

module.exports = (app) => {
    const hbs = handlebars.create({
        defaultLayout: "main",
        helpers: {
            nomeProduto: produto => produto.split('|')[0],
            ifEquals: (arg1, arg2, options) => (arg1 == arg2) ? options.fn(this) : options.inverse(this),
            formataMoeda: valor => {
                const numero = Number.parseFloat(valor);
                return isNaN(numero) ? "R$ 0,00" : `R$ ${numero.toFixed(2).replace('.', ',')}`;
            },
            formataPorcentagem: valor => {
                const numero = Number.parseFloat(valor);
                return isNaN(numero) ? "0,00%" : `${numero.toFixed(2).replace('.', ',')}%`;
            },
            add: (a, b) => a + b,
            subtract: (a, b) => a - b,
            gt: (a, b) => a > b,
            lt: (a, b) => a < b,
            eq: (a, b) => a === b
        }
    });
    app.engine("handlebars", hbs.engine);
};