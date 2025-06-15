const db = require('../config/db');

module.exports = {
  /**
   * Busca um cliente pelo e-mail.
   * @param {string} email
   * @returns {Promise<object|undefined>} Dados do cliente ou undefined caso não encontrado.
   */
  async findByEmail(email) {
    const result = await db.query(
      'SELECT id, name, phone, email FROM clients WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  /**
   * Cria um novo cliente.
   * @param {{name: string, phone: string, email: string}} data
   * @returns {Promise<object>} Cliente recém-criado (inclui id).
   */
  async create({ name, phone, email }) {
    const result = await db.query(
      'INSERT INTO clients (name, phone, email) VALUES ($1, $2, $3) RETURNING id, name, phone, email',
      [name, phone, email]
    );
    return result.rows[0];
  },

  /**
   * Retorna o cliente existente ou cria um novo caso não exista.
   * @param {{name: string, phone: string, email: string}} data
   * @returns {Promise<object>} Cliente resultante (inclui id).
   */
  async findOrCreate(data) {
    let client = await this.findByEmail(data.email);
    if (!client) {
      client = await this.create(data);
    }
    return client;
  },
}; 