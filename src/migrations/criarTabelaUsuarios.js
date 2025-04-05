const pool = require('../config/db');

const createTable = async () => {
    const queries = `
    
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            telefone VARCHAR(20) NOT NULL,
            qtd_processos VARCHAR(100) NOT NULL,
            senha TEXT NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS funcoes (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(50) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS usuario_funcoes (
            usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
            funcao_id INT REFERENCES funcoes(id) ON DELETE CASCADE,
            PRIMARY KEY (usuario_id, funcao_id)
        );

        INSERT INTO funcoes (nome) VALUES ('advogado'), ('perito');
    `;

    try {
        await pool.query(queries);
        console.log("Tabelas criadas com sucesso! ");
    } catch (error) {
        console.error("Erro ao criar tabela:", error);
    } finally {
        pool.end();
    }
};

createTable();