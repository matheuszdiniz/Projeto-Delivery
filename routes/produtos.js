// Carregando Módulos
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Produto")
const Produto = mongoose.model("produtos")

// Definindo Rotas
router.get("/", (req, res) => {
    Produto.find().lean().then(produtos => {
        res.render("produtos/index", {produtos: produtos})
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar os produtos")
        res.redirect("/")
    })
})

router.get("/novo", (req, res) => {
    res.render("produtos/novo")
})

router.post("/novo", (req, res) => {
    let erros = []
    let agora = new Date()
    let dia = agora.getDate()
    let mes = agora.getMonth() + 1
    if(dia < 10) dia = '0' + dia
    if(mes < 10) mes = '0' + mes
    agora = `${dia}/${mes}/${agora.getFullYear()}`
    const novoProduto = {
        descricao: req.body.descricao,
        barcode: req.body.barcode,
        apontamento: req.body.apontamento,
        custo: req.body.custo,
        estoque: req.body.estoque,
        validade: req.body.validade,
        data: agora
    }
    const val = novoProduto.validade.split('-')
    novoProduto.validade = `${val[2]}/${val[1]}/${val[0]}`
    const chaves = Array.from(Object.keys(novoProduto))
    chaves.forEach(element => {
        if (!novoProduto[element] || typeof novoProduto[element] == undefined || novoProduto[element] == null) erros.push({ texto: `${element} inconsistente.` })
    })
    if (erros.length > 0) {
        res.render("produtos/novo", { erros: erros })
    } else {
        new Produto(novoProduto).save().then(() => {
            req.flash("success_msg", "Produto adicionado!")
            res.redirect("/produtos")
        }).catch(error => {
            req.flash("error_msg", error + "Houve um erro ao adicionar o Produto!")
            res.redirect("/produtos/novo")
        })
    }
})

router.get("/edit/:id", (req, res) => {
    Produto.findOne({ _id: req.params.id }).lean().then(produto => {
        res.render("produtos/editar", { produto: produto })
        }).catch(erro => {
            req.flash("error_msg", "Esse produto não existe!")
            res.redirect("/produtos")
        })
})

router.post("/edit", (req, res) => {
    Produto.findOne({ _id: req.body.id }).then(produto => {
        let erros = []
        let agora = new Date()
        let dia = agora.getDate()
        let mes = agora.getMonth() + 1
        if(dia < 10) dia = '0' + dia
        if(mes < 10) mes = '0' + mes
        agora = `${dia}/${mes}/${agora.getFullYear()}`
        const informacoes = {
            descricao: req.body.descricao,
            barcode: req.body.barcode,
            apontamento: req.body.apontamento,
            custo: req.body.custo,
            estoque: req.body.estoque,
            validade: req.body.validade,
            data: agora
        }
        const val = informacoes.validade.split('-')
        informacoes.validade = `${val[2]}/${val[1]}/${val[0]}`
        const chaves = Array.from(Object.keys(informacoes))
        chaves.forEach(element => {
            if (!informacoes[element] || typeof informacoes[element] == undefined || informacoes[element] == null) erros.push({ texto: `${element} inconsistente` })
        })
        if (erros.length > 0) {
            res.render("produtos/novo", { erros: erros })
        } else {
            chaves.forEach(element => {
                produto[element] = informacoes[element]
            })
            produto.save().then(() => {
                req.flash("success_msg", "Produto editado!")
                res.redirect("/produtos")
            }).catch(erro => {
                req.flash("error_msg", "Erro ao editar o produto!")
                res.redirect("/produtos")
            })
        }
    }).catch(erro => {
        req.flash("error_msg", "Erro ao editar o produto!")
        res.redirect("/produtos")
    })
})

router.post("/deletar/:id", (req, res) => {
    Produto.findOneAndDelete({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Produto deletado!")
        res.redirect("/produtos")
    }).catch(erro => {
        req.flash("error_msg", "Houve um erro ao deletar!")
        res.redirect("/produtos")
    })
})

module.exports = router
