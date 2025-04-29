const VendaService = require("../services/VendaService");
const BaseController = require("./BaseController");

class VendaController extends BaseController {
  static async listVendas(req, res) {
    try {
      const { vendas, currentPage, totalPages } = await VendaService.getVendas(req.query.page);
      res.render("vendas/index", { vendas, current: currentPage, pages: totalPages, });
    } catch (error) {
      new VendaController().handleError(req, res, "Erro ao carregar as vendas", "/vendas");
    }
  }

  static async showNovaVenda(req, res) {
    try {
      const pratos = await VendaService.getPratos();
      res.render("vendas/nova", { prato: pratos });
    } catch (error) {
      new VendaController().handleError(req, res, "Erro ao carregar os produtos", "/vendas");
    }
  }

  static async createVenda(req, res) {
    try {
      await VendaService.createVenda(req.body);
      req.flash("success_msg", "Venda efetuada!");
      res.redirect("/vendas");
    } catch (error) {
      new VendaController().handleError(req, res, error.message || "Houve um erro ao vender!", "/vendas");
    }
  }

  static async editVendaPage(req, res) {
    try {
      const { pratos, venda } = await VendaService.getVendaForEdit(req.params.id);
      res.render("vendas/editar", { prato: pratos, venda });
    } catch (error) {
      new VendaController().handleError(req, res, "Essa venda não existe!", "/vendas");
    }
  }

  static async updateVenda(req, res) {
    try {
      await VendaService.updateVenda(req.body);
      req.flash("success_msg", "Venda editada!");
      res.redirect("/vendas");
    } catch (error) {
      new VendaController().handleError(req, res, "Erro ao editar a venda!", "/vendas");
    }
  }

  static async deleteVenda(req, res) {
    try {
      await VendaService.deleteVenda(req.params.id);
      req.flash("success_msg", "Venda deletada!");
      res.redirect("/vendas");
    } catch (error) {
      new VendaController().handleError(req, res, "Erro ao deletar a venda!", "/vendas");
    }
  }
}

module.exports = VendaController;