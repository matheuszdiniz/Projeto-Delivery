const express = require("express");
const router = express.Router();
const VendaController = require("../controllers/VendaController");
const { vendaSchema } = require("../validators/vendaValidator");
const validate = require("../middlewares/validate");

router.get("/", VendaController.listVendas);
router.get("/nova", VendaController.showNovaVenda);
router.post("/nova", validate(vendaSchema), VendaController.createVenda);
router.get("/edit/:id", VendaController.editVendaPage);
router.post("/edit", validate(vendaSchema), VendaController.updateVenda);
router.post("/deletar/:id", validate(vendaSchema, 'params'), VendaController.deleteVenda);

module.exports = router;