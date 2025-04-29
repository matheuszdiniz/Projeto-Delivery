const ProdutoService = require("../services/ProdutoService");
const DateHelper = require("../helpers/DateHelper");
const BaseController = require("./BaseController");

class ProdutoController extends BaseController {
  static async listar(req, res) {
    const perPage = 5;
    const page = parseInt(req.query.page) || 1;

    try {
      const { produtos, total } = await ProdutoService.listarProdutos(page, perPage);
      res.render("produtos/index", {
        produtos,
        current: page,
        pages: Math.ceil(total / perPage),
      });
    } catch (error) {
      new ProdutoController().handleError(req, res, "Erro ao carregar os produtos", "/produtos");
    }
  }

  static novo(req, res) {
    res.render("produtos/novo");
  }

  static async salvarNovo(req, res) {
    const { descricao, barcode, apontamento, custo, estoque, validade } = req.body;
    const dataCadastro = DateHelper.hojeFormatada();
    const validadeFormatada = DateHelper.formatarValidade(validade);

    const produto = {
      descricao,
      barcode,
      apontamento,
      custo,
      estoque,
      dataCadastro,
      validade: validadeFormatada
    };

    try {
      await ProdutoService.criarProduto(produto);
      req.flash("success_msg", "Produto adicionado!");
      res.redirect("/produtos");
    } catch (error) {
      new ProdutoController().handleError(req, res, "Houve um erro ao adicionar o Produto!", "/produtos/novo");
    }
  }

  static async editar(req, res) {
    try {
      const produto = await ProdutoService.buscarProdutoPorId(req.params.id);
      if (!produto) {
        req.flash("error_msg", "Produto não encontrado!");
        return res.redirect("/produtos");
      }
      res.render("produtos/editar", { produto });
    } catch (error) {
      new ProdutoController().handleError(req, res, "Erro ao buscar o produto!", "/produtos");
    }
  }

  static async salvarEdicao(req, res) {
    const { id, descricao, barcode, apontamento, custo, estoque, validade } = req.body;
    const dataCadastro = DateHelper.hojeFormatada();
    const validadeFormatada = DateHelper.formatarValidade(validade);

    const produtoAtualizado = {
      descricao,
      barcode,
      apontamento,
      custo,
      estoque,
      dataCadastro,
      validade: validadeFormatada
    };

    try {
      await ProdutoService.atualizarProduto(id, produtoAtualizado);
      req.flash("success_msg", "Produto editado!");
      res.redirect("/produtos");
    } catch (error) {
      new ProdutoController().handleError(req, res, "Erro ao editar o produto!", "/produtos");
    }
  }

  static async deletar(req, res) {
    try {
      await ProdutoService.deletarProduto(req.params.id);
      req.flash("success_msg", "Produto deletado!");
      res.redirect("/produtos");
    } catch (error) {
      new ProdutoController().handleError(req, res, "Erro ao deletar o produto!", "/produtos");
    }
  }
}

module.exports = ProdutoController;