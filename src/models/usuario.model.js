const pool = require('../config/db');

const UsuarioModel = {
  async listarTodos() {
    const result = await pool.query(`
      SELECT u.*, 
        ARRAY_AGG(f.nome) AS funcoes
      FROM usuarios u
      LEFT JOIN usuario_funcoes uf ON u.id = uf.usuario_id
      LEFT JOIN funcoes f ON f.id = uf.funcao_id
      GROUP BY u.id
    `);
    return result.rows;
  },

  async buscarPorId(id) {
    const result = await pool.query(`
      SELECT u.*, 
        ARRAY_AGG(f.nome) AS funcoes
      FROM usuarios u
      LEFT JOIN usuario_funcoes uf ON u.id = uf.usuario_id
      LEFT JOIN funcoes f ON f.id = uf.funcao_id
      WHERE u.id = $1
      GROUP BY u.id
    `, [id]);
    return result.rows[0];
  },

  async criar({ nome, email, telefone, senha }) {
    const result = await pool.query(`
      INSERT INTO usuarios (nome, email, telefone, senha)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [nome, email, telefone, senha]);
    return result.rows[0];
  },

  async atualizar(id, { nome, email, telefone }) {
    const result = await pool.query(`
      UPDATE usuarios
      SET nome = $1, email = $2, telefone = $3, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [nome, email, telefone, id]);
    return result.rows[0];
  },

  async deletar(id) {
    const result = await pool.query(`DELETE FROM usuarios WHERE id = $1`, [id]);
    return result.rowCount > 0;
  }
};

module.exports = UsuarioModel;
