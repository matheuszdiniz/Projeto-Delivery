const mongoose = require('mongoose');
require('../models/Prato');
const Prato = mongoose.model('pratos');

class PratoService {
  async listarPaginado(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const [pratos, total] = await Promise.all([
      Prato.find().skip(skip).limit(limit).lean(),
      Prato.countDocuments(),
    ]);
    return { pratos, total };
  }

  async buscarPorId(id) {
    return await Prato.findById(id).lean();
  }

  async criar(dados) {
    const novo = new Prato(dados);
    return await novo.save();
  }

  async atualizar(id, dados) {
    return await Prato.findByIdAndUpdate(id, dados, { new: true });
  }

  async deletar(id) {
    return await Prato.findByIdAndDelete(id);
  }
}

module.exports = new PratoService();