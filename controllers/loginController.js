// controllers/loginController.js
const db = require('../config/db');

// Login handler
exports.loginUser = async (req, res) => {
  // Destructure email and password from the request body
  const { user_email, password } = req.body;
  console.log(req.body);

  // SQL query to find user by email and password
  const query = 'SELECT * FROM login WHERE email = $1 AND password = $2';
  const values = [user_email, password];

  try {
    // Execute the query
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      console.log('Login falhou para:', user_email);
      return res.send('Email ou senha inválidos.');
    }

    // Debug: veja o que vem do banco ANTES de qualquer return
    console.log('Usuário retornado do banco:', user);

    // Tente todos os campos possíveis
    const userType = (user.user_type || user.type || user.role || user.perfil || '').trim().toLowerCase();

    if (userType === 'agency' || userType === 'agencie') {
      // Busca a agência vinculada ao login_id
      const agencyRes = await db.query('SELECT id FROM agencies WHERE login_id = $1', [user.id]);
      const agency = agencyRes.rows[0];
      if (agency) {
        // Redireciona para a tela de imóveis da agência específica
        return res.redirect(`/agencies/${agency.id}/properties`);
      } else {
        return res.send('Agência não encontrada para este login.');
      }
    } else if (userType === 'broker') {
      const brokerRes = await db.query('SELECT id FROM brokers WHERE login_id = $1', [user.id]);
      const broker = brokerRes.rows[0];
      if (broker) {
        return res.redirect(`/brokers/${broker.id}`);
      } else {
        return res.send('Corretor não encontrado para este login.');
      }
    } else {
      console.log('Tipo de usuário não suportado:', userType);
      return res.send('Tipo de usuário não suportado. Valor recebido: ' + userType);
    }
  } catch (err) {
    console.error('Erro no login:', err);
    // Return 500 in case of database or server error
    res.status(500).json({ error: err.message });
  }
};
