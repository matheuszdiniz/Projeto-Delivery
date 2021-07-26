// Carregando Móludos

const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")

const passport = require("passport")
const produtos = require("./routes/produtos")
const hamburguers = require("./routes/hamburguers")
const vendas = require('./routes/vendas')
const compras = require('./routes/compras')
var app = express()

// Configurações
// Sessão 
app.use(
    session({
        secret: "123",
        resave: true,
        saveUninitialized: true,
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

//Body Parser 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Handlebars
const hbs = handlebars.create({
    defaultLayout: "main",
    helpers: {
        nomeProduto: produto => produto.split('|')[0]
    }
})

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
//Mongoose
mongoose.connect("mongodb://localhost/WillysBurguer", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Conectado ao Mongo!")
}).catch(erro => {
    console.log("Erro: " + erro)
})

// Public
app.use(express.static(path.join(__dirname, "public")))
//Rotas

app.get("/", (req, res) => {
    res.render("index")
})

app.use("/produtos", produtos)
app.use("/hamburguers", hamburguers)
app.use("/vendas", vendas)
app.use('/compras', compras)

// Iniciar servidor
PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor iniciado!")
}) 

var {app, BrowserWindow} = require('electron')
function createWindow() {
    let win = new BrowserWindow({
        width: 1536,
        height: 864,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.webContents.openDevTools()
    win.loadURL('http://localhost:8081/')
    win.focus();
}
app.whenReady().then(createWindow)