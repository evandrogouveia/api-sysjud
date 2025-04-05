const UsuarioModel = require('../models/usuario.model');

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.listarTodos();
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const usuario = await UsuarioModel.buscarPorId(req.params.id);
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
  },

  async criar(req, res) {
    try {
      const usuario = await UsuarioModel.criar(req.body);
      res.status(201).json(usuario);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
  },

  async atualizar(req, res) {
    try {
      const usuario = await UsuarioModel.atualizar(req.params.id, req.body);
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
  },

  async deletar(req, res) {
    try {
      const sucesso = await UsuarioModel.deletar(req.params.id);
      if (!sucesso) return res.status(404).json({ erro: 'Usuário não encontrado' });
      res.json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao deletar usuário' });
    }
  }
};

module.exports = UsuarioController;
