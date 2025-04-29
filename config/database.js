const mongoose = require("mongoose");

module.exports = () => {
    const uri = process.env.DB_URI;

    mongoose.connect(uri).then(() => {
        console.log("Conectado ao MongoDB!");
    }).catch(erro => {
        console.error("Erro ao conectar com o MongoDB:", erro);
        process.exit(1);
    });
};
