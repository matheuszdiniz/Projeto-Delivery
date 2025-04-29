require('dotenv').config();
const express = require("express");
const path = require("path");
const middleware = require("./config/middleware");
const handlebarsConfig = require("./config/handlebars");
const databaseConfig = require("./config/database");
const produtos = require("./routes/produtos");
const pratos = require("./routes/pratos");
const vendas = require("./routes/vendas");
const relatorios = require("./routes/relatorios");

// Criar instância do app Express
const app = express();

// Configurar o middleware
middleware(app);

// Configurar o Handlebars
handlebarsConfig(app);

// Configurar a conexão com o banco de dados
databaseConfig();

// Definir o diretório base e configurar o caminho das views
const basePath = __dirname;
app.set("views", path.join(basePath, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(basePath, "public")));

// Rota principal
app.get("/", (req, res) => {
    res.render("index");
});

// Rotas de produtos, pratos, vendas e relatórios
app.use("/produtos", produtos);
app.use("/pratos", pratos);
app.use("/vendas", vendas);
app.use("/relatorios", relatorios);

// Iniciar o servidor após a conexão com o banco de dados
const server = app.listen(0, () => {
    const port = server.address().port;
    console.log("Servidor iniciado na porta:", `http://localhost:${port}`);
    require('./config/electron')(port);
});
