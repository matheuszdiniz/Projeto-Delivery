const mongoose = require("mongoose");
const Venda = mongoose.model("vendas");
const Prato = mongoose.model("pratos");

class RelatorioService {
  static async buscarVendas(dataInicial, dataFinal) {
    
    const dataInicialSplit = dataInicial.split('-');
    const dataFinalSplit = dataFinal.split('-');
    const dataInicialFormatada = `${dataInicialSplit[2]}/${dataInicialSplit[1]}/${dataInicialSplit[0]}`
    const dataFinalFormatada = `${dataFinalSplit[2]}/${dataFinalSplit[1]}/${dataFinalSplit[0]}`
    const vendas = await Venda.find({
      data: {
        $gte: dataInicialFormatada,
        $lte: dataFinalFormatada,
      },
    }).lean();

    const vendasComProdutos = await Promise.all(vendas.map(async (venda) => {
      const produtoIds = venda.produto.map(id => id.toString());
      const pratos = await Prato.find({ _id: { $in: produtoIds } }).lean();
      const pratosOrdenados = produtoIds.map(id => 
        pratos.find(h => h._id.toString() === id)
      );

      const itens = pratosOrdenados.map((h, index) => {
        const quantidade = venda.quantidade?.[index] || 0;
        return {
          nome: h?.nome || "Produto não encontrado",
          quantidade,
          custoFinal: h?.custoFinal || 0,
          venda: h?.valorPrato || 0,
          markup: h?.markupPrato || 0,
          margem: h?.margemPrato || 0
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
      quantidade: vendasComProdutos.reduce((acc, v) => acc + (parseFloat(v.qtdTotal) || 0), 0),
    };

    totais.markup = parseFloat(((totais.venda / totais.custo) - 1) * 100) || 0;
    totais.margem = parseFloat(((totais.venda - totais.custo) / totais.venda) * 100) || 0;

    return { vendasComProdutos, totais };
  }
}

module.exports = RelatorioService;