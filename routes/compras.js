// Carregando Módulos

const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Produto")
require("../models/Hamburguer")
require("../models/Venda")
require('../models/Compra')
const Compra = mongoose.model('compras')
const Venda = mongoose.model("vendas")
const Hamburguer = mongoose.model("hamburguers")
const Produto = mongoose.model("produtos")

// Definindo Rotas

router.get("/", (req, res) => {
    Compra.find().lean().then(compras => {
        res.render("compras/index", {compras: compras})
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar as Compras")
        res.redirect("/compras")
    })
})

router.get("/nova", (req, res) => {
    Produto.find().lean().then(produtos => {
        res.render("compras/nova", {produtos: produtos})
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar os produtos")
        res.redirect("/compras")
    })
})
 
router.post('/nova', (req, res) => {

    let erros = []
    let agora = new Date()
    let dia = agora.getDate()
    let mes = agora.getMonth() + 1
    if(dia < 10) dia = '0' + dia
    if(mes < 10) mes = '0' + mes
    agora = `${dia}/${mes}/${agora.getFullYear()}`

    function arr (e) {
        if (!Array.isArray(e)){
            let i = []
            i.push(e)
            return i
        } 
    }

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

    const elementos = {
        ingredientes: arring,
        id: arrIdIg,
        quantidade: arr(req.body.quantidade),
        custo: arr(req.body.custo),
        validade: arr(req.body.validade),
        compraTotal: req.body.custoFinal,
        data: agora,
        date: Date.parse(agora)
    }

    elementos.ingredientes.forEach((element, index) => {
        const id = elementos.id[index]
        Produto.findOne({_id: id}).then(produto => {
            let v = (elementos.validade[index]).split('-')
            produto.custo = (Number.parseFloat((elementos.custo[index]).replace(',','.'))).toFixed(2)
            produto.estoque = (Number.parseFloat(produto.estoque) + Number.parseFloat(elementos.quantidade[index])).toFixed(3)
            produto.validade = `${v[2]}/${v[1]}/${v[0]}`
            produto.save()
        }).catch(error => {
            req.flash("error_msg", error + "Erro ao registrar a compra")
            res.redirect("/compras")
        })
    })

    const chaves = Array.from(Object.keys(elementos))
    chaves.forEach(element => {
        if (!elementos[element] || typeof elementos[element] == undefined || elementos[element] == null) erros.push({ texto: `${element} incosistente.` })
    })
    if (erros.length > 0) {
        res.render("compras/nova", { erros: erros })
    } else {
        new Compra(elementos).save().then(()=> {
            req.flash("success_msg", "Compra Concluida")
            res.redirect("/compras")
        }).catch(error => {
            req.flash("error_msg", "Houve um erro ao comprar")
            res.redirect("/compras")
        })
    }
})

router.get("/edit/:id", (req, res) => {
    Hamburguer.find().lean().then(hamburguer => {
        Venda.findOne({ _id: req.params.id }).lean().then(venda => {
            res.render("vendas/editar", { hamburguer: hamburguer, venda: venda})
            }).catch(erro => {
                req.flash("error_msg", "Essa venda não existe!")
                res.redirect("/vendas")
            })
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar os produtos")
        res.redirect("/vendas")
    })
})

router.post("/edit", (req, res) => {
    Venda.findOne({ _id: req.body.id }).then(venda => {
        Array.from(req.body.idHamb).forEach(elemento => {
            Hamburguer.findOne({ _id: elemento }).then(hamburguer => {
                hamburguer.idIgrediente.forEach((element, index) => {
                    Produto.findOne({ _id: element}).then(produto => {
                        produto.estoque = ((Number.parseFloat(produto.estoque)) - (Number.parseFloat(hamburguer.quantidade[index]))).toFixed(3)
                        produto.save()
                    }).catch(error => {
                        req.flash("error_msg", "Houve um erro ao vender!")
                        res.redirect("/vendas") 
                    })
                }) 
            }).catch(error => {
                req.flash("error_msg", "Houve um erro ao vender!")
                res.redirect("/vendas") 
            })
        })
        let erros = []
        let agora = new Date()
        let dia = agora.getDate()
        let mes = agora.getMonth() + 1
        if(dia < 10) dia = '0' + dia
        if(mes < 10) mes = '0' + mes
        agora = `${dia}/${mes}/${agora.getFullYear()}`
        const novaVenda = {
            cliente: req.body.cliente,
            endereco: req.body.endereco,
            produto: req.body.produtos,
            quantidade: req.body.quantidade,
            custoVenda: req.body.custoFinal,
            taxa: req.body.entrega,
            venda: req.body.venda,
            markup: req.body.markup,
            margem: req.body.margem,
            data: agora
        }
        const chaves = Array.from(Object.keys(novaVenda))
        chaves.forEach(element => {
            if (!novaVenda[element] || typeof novaVenda[element] == undefined || novaVenda[element] == null) erros.push({ texto: `${element} incosistente.` })
        })
        if (erros.length > 0) {
            res.render("vendas/edit", { erros: erros })
        } else {
            chaves.forEach(element => {
                venda[element] = novaVenda[element]
            })
            venda.save().then(() => {
                req.flash("success_msg", "Venda editado!")
                res.redirect("/vendas")
            }).catch(erro => {
                req.flash("error_msg", "Erro ao editar o venda!")
                res.redirect("/vendas")
            })
        }
    }).catch(erro => {
        req.flash("error_msg","Erro ao editar a Venda!")
        res.redirect("/vendas")
    })
})

router.post("/deletar/:id", (req, res) => {
    Compra.findOneAndDelete({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Compra deletada!")
        res.redirect("/compras")
    }).catch(erro => {
        req.flash("error_msg", "Houve um erro ao deletar!")
        res.redirect("/compras")
    })
})

module.exports = router