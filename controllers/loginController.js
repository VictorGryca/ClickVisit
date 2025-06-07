// controllers/loginController.js
const Login = require('../models/login');

// Login handler
exports.loginUser = async (req, res) => {
  // Destructure email and password from the request body
  const { user_email, password } = req.body;
  console.log(req.body);

  try {
    // Find user by email and password
    const user = await Login.findByEmailAndPassword(user_email, password);

    if (!user) {
      console.log('Login falhou para:', user_email);
      return res.send('Email ou senha inválidos.');
    }

    // Debug: veja o que vem do banco ANTES de qualquer return
    console.log('Usuário retornado do banco:', user);

    // Tente todos os campos possíveis
    const userType = (user.user_type || user.type || user.role || user.perfil || '').trim().toLowerCase();

    if (userType === 'admin') {
      // Redireciona para a tela de admin
      return res.redirect('/admin');
    } else if (userType === 'agency' || userType === 'agencie') {
      // Busca a agência vinculada ao login_id
      const agency = await Login.findAgencyByLoginId(user.id);
      if (agency) {
        // Redireciona para a tela de imóveis da agência específica
        return res.redirect(`/agencies/${agency.id}/properties`);
      } else {
        return res.send('Agência não encontrada para este login.');
      }
    } else if (userType === 'broker') {
      const broker = await Login.findBrokerByLoginId(user.id);
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
