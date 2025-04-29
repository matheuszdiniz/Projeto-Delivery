const mongoose = require("mongoose");
const Produto = mongoose.model("produtos");
const PratoService = require("../services/PratoService");
const DateHelper = require("../helpers/DateHelper");
const IngredienteHelper = require("../helpers/IngredienteHelper");

class PratoController {
  static async index(req, res) {
    const page = parseInt(req.query.page) || 1;

    try {
      const { pratos, total } = await PratoService.listarPaginado(page);
      res.render("pratos/index", {
        pratos,
        currentPage: page,
        totalPages: Math.ceil(total / 5),
      });
    } catch (err) {
      this.handleError(req, res, "Erro ao carregar os pratos.", "/");
    }
  }

  static async novoForm(req, res) {
    try {
      const produtos = await Produto.find().lean();
      res.render("pratos/novo", { produtos });
    } catch {
      this.handleError(req, res, "Erro ao carregar os produtos.", "/");
    }
  }

  static async salvar(req, res) {
    try {
      const { arrNomes, arrIds } = IngredienteHelper.tratar(req.body.ingredientes);

      const prato = {
        nome: req.body.nome,
        ingredientes: arrNomes,
        qtdIngrediente: req.body.qtdIngrediente,
        idIngrediente: arrIds,
        custoIngrediente: req.body.custoIngrediente,
        custoFinal: req.body.custoFinal,
        valorPrato: req.body.valorPrato,
        markupPrato: req.body.markupPrato,
        margemPrato: req.body.margemPrato,
        data: DateHelper.hojeFormatada(),
      };

      await PratoService.criar(prato);
      req.flash("success_msg", "Prato adicionado!");
      res.redirect("/pratos");
    } catch {
      this.handleError(req, res, "Erro ao adicionar o prato.", "/pratos/novo");
    }
  }

  static async editarForm(req, res) {
    try {
      const [prato, produtos] = await Promise.all([
        PratoService.buscarPorId(req.params.id),
        Produto.find().lean(),
      ]);

      if (!prato) throw new Error();
      res.render("pratos/editar", { prato, produtos });
    } catch {
      this.handleError(req, res, "Erro ao carregar prato.", "/pratos");
    }
  }

  static async salvarEdicao(req, res) {
    try {
      const { arrNomes, arrIds } = IngredienteHelper.tratar(req.body.ingredientes);

      const pratoAtualizado = {
        nome: req.body.nome,
        ingredientes: arrNomes,
        qtdIngrediente: req.body.qtdIngrediente,
        idIngrediente: arrIds,
        custoIngrediente: req.body.custoIngrediente,
        custoFinal: req.body.custoFinal,
        valorPrato: req.body.valorPrato,
        markupPrato: req.body.markupPrato,
        margemPrato: req.body.margemPrato,
        data: DateHelper.hojeFormatada(),
      };

      await PratoService.atualizar(req.body.id, pratoAtualizado);
      req.flash("success_msg", "Prato editado!");
      res.redirect("/pratos");
    } catch {
      this.handleError(req, res, "Erro ao editar o prato.", "/pratos");
    }
  }

  static async deletar(req, res) {
    try {
      await PratoService.deletar(req.params.id);
      req.flash("success_msg", "Prato deletado!");
      res.redirect("/pratos");
    } catch {
      this.handleError(req, res, "Erro ao deletar o prato.", "/pratos");
    }
  }

  static handleError(req, res, mensagem, redirecionar) {
    req.flash("error_msg", mensagem);
    res.redirect(redirecionar);
  }
}

module.exports = PratoController;