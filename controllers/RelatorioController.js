const RelatorioService = require("../services/RelatorioService");
const puppeteer = require("puppeteer");

class RelatorioController {
  static async renderizarRelatorioVendas(req, res) {
    try {
      const { dataInicial, dataFinal } = req.query;
      if (!dataInicial || !dataFinal) {
        return res.status(400).send("Datas inicial e final são obrigatórias.");
      }

      const { vendasComProdutos, totais } = await RelatorioService.buscarVendas(dataInicial, dataFinal);

      res.render("relatorios/vendas", {
        vendas: vendasComProdutos,
        totais,
        isPDF: false,
        dataInicial,
        dataFinal
      });

    } catch (error) {
      console.error("[RelatorioController] Erro ao renderizar relatório de vendas:", error);
      res.status(500).send("Erro interno ao gerar relatório.");
    }
  }

  static async gerarRelatorioVendasPDF(req, res) {
    try {
      const { dataInicial, dataFinal } = req.query;
      if (!dataInicial || !dataFinal) {
        return res.status(400).send("Datas inicial e final são obrigatórias.");
      }

      const { vendasComProdutos, totais } = await RelatorioService.buscarVendas(dataInicial, dataFinal);
      const absoluteCssPath = `${req.protocol}://${req.get("host")}/css/Relatorio.css`;

      const html = await new Promise((resolve, reject) => {
        req.app.render("relatorios/vendas", {
          vendas: vendasComProdutos,
          totais,
          isPDF: true,
          dataInicial,
          dataFinal,
          absoluteCssPath
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
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="relatorio-vendas.pdf"',
        "Content-Length": pdf.length
      });

      res.send(pdf);

    } catch (error) {
      console.error("[RelatorioController] Erro ao gerar PDF de relatório de vendas:", error);
      res.status(500).send("Erro interno ao gerar PDF.");
    }
  }
}

module.exports = RelatorioController;