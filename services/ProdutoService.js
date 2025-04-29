const mongoose = require('mongoose');
require('../models/Produto');
const Produto = mongoose.model('produtos');

class ProdutoService {
  async listarProdutos(page, perPage) {
    const produtos = await Produto.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();
    const total = await Produto.countDocuments();
    return { produtos, total };
  }

  async criarProduto(produtoData) {
    const produto = new Produto(produtoData);
    await produto.save();
  }

  async buscarProdutoPorId(id) {
    return await Produto.findById(id).lean();
  }

  async atualizarProduto(id, dadosAtualizados) {
    const produto = await this._buscarOuFalhar(id);
    Object.keys(dadosAtualizados).forEach(key => {
      produto[key] = dadosAtualizados[key];
    });
    await produto.save();
  }

  async deletarProduto(id) {
    await this._buscarOuFalhar(id);
    await Produto.findByIdAndDelete(id);
  }

  // Método privado para reaproveitar busca + erro
  async _buscarOuFalhar(id) {
    const produto = await Produto.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    return produto;
  }
}

module.exports = new ProdutoService();