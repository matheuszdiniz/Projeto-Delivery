const mongoose = require("mongoose");
require('../models/Venda');
const Venda = mongoose.model("vendas");
const Produto = mongoose.model("produtos");
const Prato = mongoose.model("pratos");

class VendaService {
  constructor() {}

  async getVendas(page = 1) {
    const porPagina = 5;
    const paginaAtual = parseInt(page) || 1;

    const totalVendas = await Venda.countDocuments();
    const vendas = await Venda.find()
      .skip((paginaAtual - 1) * porPagina)
      .limit(porPagina)
      .lean();

    return {
      vendas,
      currentPage: paginaAtual,
      totalPages: Math.ceil(totalVendas / porPagina)
    };
  }

  async getPratos() {
    return await Prato.find().lean();
  }

  async createVenda(body) {
    const { produtos, quantidade } = body;

    for (const [index, pratoId] of produtos.entries()) {
      for (let x = 0; x < quantidade[index]; x++) {
        await this.atualizarEstoqueIngredientes(pratoId);
      }
    }

    const novaVenda = this.montarVenda(body);
    this.validarCamposObrigatorios(novaVenda);

    await new Venda(novaVenda).save();
  }

  async getVendaForEdit(id) {
    const pratos = await Prato.find().lean();
    const venda = await Venda.findOne({ _id: id }).lean();
    if (!venda) throw new Error("Venda não encontrada");
    return { pratos, venda };
  }

  async updateVenda(body) {
    const venda = await Venda.findOne({ _id: body.id });
    if (!venda) throw new Error("Venda não encontrada");

    for (const pratoId of body.produtos) {
      await this.atualizarEstoqueIngredientes(pratoId);
    }

    const vendaAtualizada = this.montarVenda(body, true);
    Object.assign(venda, vendaAtualizada);

    await venda.save();
  }

  async deleteVenda(id) {
    await Venda.findOneAndDelete({ _id: id });
  }

  async atualizarEstoqueIngredientes(pratoId) {
    const prato = await Prato.findOne({ _id: pratoId });
    if (!prato) throw new Error(`Prato com ID ${pratoId} não encontrado.`);

    for (let i = 0; i < prato.idIngrediente.length; i++) {
      const produto = await Produto.findOne({ _id: prato.idIngrediente[i] });
      if (!produto) throw new Error(`Produto com ID ${prato.idIngrediente[i]} não encontrado.`);

      produto.estoque = (parseFloat(produto.estoque) - parseFloat(prato.qtdIngrediente[i])).toFixed(3);
      await produto.save();
    }
  }

  montarVenda(body, isUpdate = false) {
    const agora = this.formatarDataAtual();
    return {
      cliente: body.cliente,
      endereco: body.endereco,
      produto: body.produtos,
      quantidade: body.quantidade,
      custoVenda: body.custoVenda,
      taxa: body.taxa,
      venda: body.venda,
      markup: body.markup,
      margem: body.margem,
      data: isUpdate ? agora : (body.data ? this.formatarData(body.data) : agora)
    };
  }

  validarCamposObrigatorios(venda) {
    const campos = Object.keys(venda);
    campos.forEach(campo => {
      if (venda[campo] === undefined || venda[campo] === null || venda[campo] === '') {
        throw new Error(`Campo ${campo} inconsistente.`);
      }
    });
  }

  formatarData(dataInput) {
    const [ano, mes, dia] = dataInput.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  formatarDataAtual() {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${agora.getFullYear()}`;
  }
}

module.exports = new VendaService();