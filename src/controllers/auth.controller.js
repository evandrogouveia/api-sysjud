const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SECRET = process.env.JWT_SECRET;

const AuthController = {
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      const usuario = result.rows[0];

      if (!usuario) {
        return res.status(401).json({ erro: 'Usuário não encontrado' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha inválida' });
      }

      const funcoes = await pool.query(`
        SELECT f.nome 
        FROM usuario_funcoes uf
        JOIN funcoes f ON f.id = uf.funcao_id
        WHERE uf.usuario_id = $1
      `, [usuario.id]);

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          funcoes: funcoes.rows.map(f => f.nome)
        },
        SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          funcoes: funcoes.rows.map(f => f.nome)
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  }
};

module.exports = AuthController;
