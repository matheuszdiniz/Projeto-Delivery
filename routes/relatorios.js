const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const puppeteer = require('puppeteer');
require("../models/Produto")
require("../models/Hamburguer")
require("../models/Venda")
const Venda = mongoose.model("vendas")
const Hamburguer = mongoose.model("hamburguers")
const Produto = mongoose.model("produtos")

router.get("/", (req, res) => {
        res.render("relatorios/index")
})

router.get("/vendas", async (req, res) => {
  try {
    const { dataInicial, dataFinal } = req.query;
    const dataInicialSplit = dataInicial.split('-');
    const dataFinalSplit = dataFinal.split('-');
    const dataInicialFormatada = `${dataInicialSplit[2]}/${dataInicialSplit[1]}/${dataInicialSplit[0]}`
    const dataFinalFormatada = `${dataFinalSplit[2]}/${dataFinalSplit[1]}/${dataFinalSplit[0]}`
    const vendas = await Venda.find({
      data: { 
        $gte: dataInicialFormatada, 
        $lte: dataFinalFormatada
      }
    }).lean();

    const vendasComProdutos = await Promise.all(vendas.map(async (venda) => {
      const produtoIds = venda.produto.map(id => id.toString());
      const hamburguers = await Hamburguer.find({ _id: { $in: produtoIds } }).lean();
      const hamburguersOrdenados = produtoIds.map(id =>
        hamburguers.find(h => h._id.toString() === id)
      );
      const itens = hamburguersOrdenados.map((h, index) => {
        const quantidade = venda.quantidade?.[index] || 0;
        return {
          nome: h?.nome || "Produto não encontrado",
          quantidade,
          custoFinal: h?.custoFinal || 0,
          venda: h?.venda || 0,
          markup: h?.markup || 0,
          margem: h?.margem || 0
        };
      });
      return {
        cliente: venda.cliente,
        endereco: venda.endereco,
        data: venda.data,
        custoVenda: venda.custoVenda,
        taxa: venda.taxa,
        vendaTotal: venda.venda,
        markup: venda.markup,
        margem: venda.margem,
        itens,
        qtdTotal: itens.reduce((acc, v) => acc + (parseFloat(v.quantidade) || 0), 0),
      };
    }));

    const totais = {
      venda: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.vendaTotal) || 0), 0),
      custo: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.custoVenda) || 0), 0),
      taxa: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.taxa) || 0), 0),
      markup: 0,
      margem: 0,
      quantidade: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.qtdTotal) || 0), 0)
    };
    totais.markup = parseFloat(((totais.venda / totais.custo) - 1) * 100) || 0;
    totais.margem = parseFloat(((totais.venda - totais.custo) / totais.venda) * 100) || 0;

    res.render("relatorios/vendas", {
      vendas: vendasComProdutos,
      totais,
      isPDF: false,
      dataInicial,
      dataFinal
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar relatório de vendas");
  }
});

router.get("/vendas/pdf", async (req, res) => {
    try {
      const { dataInicial, dataFinal } = req.query;
      const dataInicialSplit = dataInicial.split('-');
      const dataFinalSplit = dataFinal.split('-');
      const dataInicialFormatada = `${dataInicialSplit[2]}/${dataInicialSplit[1]}/${dataInicialSplit[0]}`
      const dataFinalFormatada = `${dataFinalSplit[2]}/${dataFinalSplit[1]}/${dataFinalSplit[0]}`
      const vendas = await Venda.find({
        data: { 
          $gte: dataInicialFormatada, 
          $lte: dataFinalFormatada
        }
      }).lean();
      const vendasComProdutos = await Promise.all(vendas.map(async (venda) => {
        const produtoIds = venda.produto.map(id => id.toString());
        const hamburguers = await Hamburguer.find({ _id: { $in: produtoIds } }).lean();
        const hamburguersOrdenados = produtoIds.map(id =>
          hamburguers.find(h => h._id.toString() === id)
        );
        const itens = hamburguersOrdenados.map((h, index) => {
        const quantidade = venda.quantidade?.[index] || 0;
          return {
            nome: h?.nome || "Produto não encontrado",
            quantidade,
            custoFinal: h?.custoFinal || 0,
            venda: h?.venda || 0,
            markup: h?.markup || 0,
            margem: h?.margem || 0
          };
        });
        return {
          cliente: venda.cliente,
          endereco: venda.endereco,
          data: venda.data,
          custoVenda: venda.custoVenda,
          taxa: venda.taxa,
          vendaTotal: venda.venda,
          markup: venda.markup,
          margem: venda.margem,
          itens,
          qtdTotal: itens.reduce((acc, v) => acc + (parseFloat(v.quantidade) || 0), 0),
        };
      }));
      const totais = {
        venda: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.vendaTotal) || 0), 0),
        custo: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.custoVenda) || 0), 0),
        taxa: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.taxa) || 0), 0),
        markup: 0,
        margem: 0,
        quantidade: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.qtdTotal) || 0), 0)
      }
      totais.markup = parseFloat(((totais.venda / totais.custo) - 1) * 100) || 0
      totais.margem = parseFloat(((totais.venda - totais.custo) / totais.venda) * 100) || 0

      const html = await new Promise((resolve, reject) => {
        req.app.render("relatorios/vendas", {
          vendas: vendasComProdutos, 
          isPDF: true,
          totais
        }, (err, html) => {
          if (err) return reject(err);
          resolve(html);
        });
      });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="relatorio-vendas.pdf"',
        'Content-Length': pdf.length
      });
      res.send(pdf);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao gerar relatório de vendas");
    }
  });

module.exports = router