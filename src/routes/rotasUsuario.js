const express = require('express');
const { criar, listar, buscarPorId, atualizar, deletar } = require('../controllers/usuario.controller');
const AuthController = require('../controllers/auth.controller');


const router = express.Router();

/*---------- ROTAS DE USUÁRIO -----------*/
router.post('/login', AuthController.login);
router.post('/criar', criar);
router.get('/listar', listar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;