// Carregando Módulos
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Produto")
require("../models/Hamburguer")
const Hamburguer = mongoose.model("hamburguers")
const Produto = mongoose.model("produtos")

// Definindo Rotas

router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    try {
        const [hamburguers, total] = await Promise.all([
            Hamburguer.find().skip(skip).limit(limit).lean(),
            Hamburguer.countDocuments()
        ]);

        const totalPages = Math.ceil(total / limit);

        res.render("hamburguers/index", {
            hamburguers,
            currentPage: page,
            totalPages
        });

    } catch (error) {
        req.flash("error_msg", "Erro ao carregar os hambúrgueres.");
        res.redirect("/");
    }
});


router.get("/novo", (req, res) => {
    Produto.find().lean().then(produtos => {
        res.render("hamburguers/novo", {produtos: produtos})
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar os produtos")
        res.redirect("/")
    })
})
 
router.post("/novo", (req, res) => {
    let erros = []
    let agora = new Date()
    agora = agora.getDate() + "/" + (agora.getMonth() + 1) + "/" + agora.getFullYear()
    let arrIdIg = []
    let arring = []
    let arrayIngredientes = req.body.ingredientes
    if (!Array.isArray(arrayIngredientes)){
        let i = []
        i.push(arrayIngredientes)
        arrayIngredientes = i
    } 
    arrayIngredientes.forEach(element => {
        arring.push(element.split('|')[0])
        arrIdIg.push(element.split('|')[1])
    })
    const novoHamburguer = {
        nome: req.body.nome,
        ingredientes: arring,
        quantidade: req.body.quantidade,
        idIgrediente: arrIdIg,
        custo: req.body.custo,
        custoFinal: req.body.custoFinal,
        venda: req.body.venda,
        markup: req.body.markup,
        margem: req.body.margem,
        data: agora,
    }
    const chaves = Array.from(Object.keys(novoHamburguer))
    chaves.forEach(element => {
        if (!novoHamburguer[element] || typeof novoHamburguer[element] == undefined || novoHamburguer[element] == null) erros.push({ texto: `${element} incosistente.` })
    })
    if (erros.length > 0) {
        res.render("hamburguers/novo", { erros: erros })
    } else {
        new Hamburguer(novoHamburguer).save().then(() => {
            req.flash("success_msg", "Hamburguer adicionado!")
            res.redirect("/hamburguers")
        }).catch(error => {
            req.flash("error_msg", error + "Houve um erro ao adicionar o Hamburguer!")
            res.redirect("/hamburguers/novo")
        })
    }
})

router.get("/edit/:id", (req, res) => {
    Produto.find().lean().then(produtos => {
        Hamburguer.findOne({ _id: req.params.id }).lean().then(hamburguer => {
            res.render("hamburguers/editar", { hamburguer: hamburguer, produtos: produtos })
            }).catch(erro => {
                req.flash("error_msg", "Esse Hamburguer não existe!")
                res.redirect("/hamburguers")
            })
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar os produtos")
        res.redirect("/")
    })
    
})

router.post("/edit", (req, res) => {
    Hamburguer.findOne({ _id: req.body.id }).then(hamburguer => {
        let erros = []
        let agora = new Date()
        agora = agora.getDate() + "/" + (agora.getMonth() + 1) + "/" + agora.getFullYear()
        let arrIdIg = []
        let arring = []
        let arrayIngredientes = req.body.ingredientes
        if (!Array.isArray(arrayIngredientes)){
            let i = []
            i.push(arrayIngredientes)
            arrayIngredientes = i
        } 
        arrayIngredientes.forEach(element => {
            arring.push(element.split('|')[0])
            arrIdIg.push(element.split('|')[1])
        })
        const novoHamburguer = {
            nome: req.body.nome,
            ingredientes: arring,
            quantidade: req.body.quantidade,
            idIgrediente: arrIdIg,
            custo: req.body.custo,
            custoFinal: req.body.custoFinal,
            venda: req.body.venda,
            markup: req.body.markup,
            margem: req.body.margem,
            data: agora,
        }
        const chaves = Array.from(Object.keys(novoHamburguer))
        chaves.forEach(element => {
            if (!novoHamburguer[element] || typeof novoHamburguer[element] == undefined || novoHamburguer[element] == null) erros.push({ texto: `${element} incosistente.` })
        })
        if (erros.length > 0) {
            res.render("hamburguers/novo", { erros: erros })
        } else {
            chaves.forEach(element => {
                hamburguer[element] = novoHamburguer[element]
            })
            hamburguer.save().then(() => {
                req.flash("success_msg", "Hamburguer editado!")
                res.redirect("/hamburguers")
            }).catch(erro => {
                req.flash("error_msg", "Erro ao editar o hamburguer!")
                res.redirect("/hamburguers")
            })
        }
    }).catch(erro => {
        req.flash("error_msg","Erro ao editar o hamburguer!")
        res.redirect("/hamburguers")
    })
})

router.post("/deletar/:id", (req, res) => {
    Hamburguer.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "Hamburguer deletado!")
            res.redirect("/hamburguers")
        })
        .catch(erro => {
            req.flash("error_msg", "Houve um erro ao deletar!")
            res.redirect("/hamburguers")
        })
})

module.exports = router

