const UsuarioModel = require('../models/usuario.model');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

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
      const { nome, email, telefone, qtd_processos, senha } = req.body;
  
      if (!senha) {
        return res.status(400).json({ erro: 'Senha é obrigatória' });
      }

      const verificaEmail = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);

      if (verificaEmail.rowCount > 0) {
        return res.status(409).json({ erro: 'Email já cadastrado' });
      }
  
      const senhaCriptografada = await bcrypt.hash(senha, 10);
  
      const novoUsuario = await UsuarioModel.criar({
        nome,
        email,
        telefone,
        qtd_processos,
        senha: senhaCriptografada
      });
  
      res.status(201).json(novoUsuario);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).json({ erro: 'Erro ao criar usuário', err });
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
