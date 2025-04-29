const express = require("express");
const router = express.Router();
const RelatorioController = require("../controllers/RelatorioController");

router.get("/", (req, res) => {
  res.render("relatorios/index");
});

router.get("/vendas", RelatorioController.renderizarRelatorioVendas);
router.get("/vendas/pdf", RelatorioController.gerarRelatorioVendasPDF);

module.exports = router;