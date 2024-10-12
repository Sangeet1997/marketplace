const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

module.exports = auth;
