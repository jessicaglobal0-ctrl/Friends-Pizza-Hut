const jwt = require('jsonwebtoken');

function verifySocketJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { verifySocketJWT };
