const express = require('express');
const rotasUsuario = require('./rotasUsuario');

const router = express.Router();

router.use('/usuarios', rotasUsuario);

module.exports = router;