const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');
const validate = require('../middlewares/validate');
const { produtoSchema } = require('../validators/produtoValidator');

router.get('/', ProdutoController.listar);
router.get('/novo', ProdutoController.novo);
router.post('/novo', validate(produtoSchema), ProdutoController.salvarNovo);
router.get('/edit/:id', ProdutoController.editar);
router.post('/edit', validate(produtoSchema), ProdutoController.salvarEdicao);
router.post('/deletar/:id', ProdutoController.deletar);

module.exports = router;
