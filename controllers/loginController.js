// controllers/loginController.js
const pool = require('../config/db');

// Login handler
exports.loginUser = async (req, res) => {
  // Destructure email and password from the request body
  const { user_email, password } = req.body;
  console.log(req.body);

  // SQL query to find user by email and password
  const query = 'SELECT * FROM "Login" WHERE user_email = $1 AND password = $2';
  const values = [user_email, password];

  try {
    // Execute the query
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (user) {
      // If user is found, store login ID in session and redirect
      req.session.userId = user.login_id;
      res.redirect('/welcome');
    } else {
      // If no user found, send invalid credentials message
      res.send('Invalid email or password.');
    }
  } catch (err) {
    // Return 500 in case of database or server error
    res.status(500).json({ error: err.message });
  }
}
