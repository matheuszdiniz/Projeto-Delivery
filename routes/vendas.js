// Carregando Módulos

const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Produto")
require("../models/Hamburguer")
require("../models/Venda")
const Venda = mongoose.model("vendas")
const Hamburguer = mongoose.model("hamburguers")
const Produto = mongoose.model("produtos")

// Definindo Rotas

router.get("/", (req, res) => {
    Venda.find().lean().then(vendas => {
        res.render("vendas/index", {vendas: vendas})
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar as Vendas")
        res.redirect("/vendas")
    })
})


router.get("/nova", (req, res) => {
    Hamburguer.find().lean().then(hamburguer=> {
        res.render("vendas/nova", {hamburguer: hamburguer})
    }).catch(error => {
        req.flash("error_msg", "Erro ao carregar os produtos")
        res.redirect("/vendas")
    })
})
 
router.post('/nova', (req, res) => {
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
        data: req.body.data
    }
    if(!novaVenda.data || typeof novaVenda.data == undefined || novaVenda.data == null) {
        novaVenda.data = agora
    }else{
        novaVenda.data = `${novaVenda.data.split('-')[2]}/${novaVenda.data.split('-')[1]}/${novaVenda.data.split('-')[0]}`
    }
    const chaves = Array.from(Object.keys(novaVenda))
    chaves.forEach(element => {
        if (!novaVenda[element] || typeof novaVenda[element] == undefined || novaVenda[element] == null) erros.push({ texto: `${element} incosistente.` })
    })
    if (erros.length > 0) {
        res.render("vendas/edit", { erros: erros })
    } else {
        new Venda(novaVenda).save().then(()=> {
            req.flash("success_msg", "Venda efetuada!")
            res.redirect("/vendas")
        }).catch(error => {
            req.flash("error_msg", "Houve um erro ao vender!")
            res.redirect("/vendas")
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
    Venda.findOneAndDelete({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Venda deletada!")
        res.redirect("/vendas")
    }).catch(erro => {
        req.flash("error_msg", "Houve um erro ao deletar!")
        res.redirect("/vendas")
    })
})

module.exports = router