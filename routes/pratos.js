const express = require("express");
const router = express.Router();
const PratoController = require("../controllers/PratoController");
const validate = require("../middlewares/validate");
const { pratoSchema } = require("../validators/pratoValidator");

router.get("/", PratoController.index);
router.get("/novo", PratoController.novoForm);
router.post("/novo", validate(pratoSchema), PratoController.salvar);
router.get("/edit/:id", PratoController.editarForm);
router.post("/edit", validate(pratoSchema), PratoController.salvarEdicao);
router.post("/deletar/:id", PratoController.deletar);

module.exports = router;