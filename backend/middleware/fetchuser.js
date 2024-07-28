const jwt = require('jsonwebtoken');
const JWT_Secret = process.env.JWT_Secret;

const fetchuser = (req, res, next) => {
  // Get the JWT token from the request header
  const token = req.header('authtoken');
  if (!token) {
    // If no token is provided, send an unauthorized response
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    // Verify the token using the secret key
    const data = jwt.verify(token, JWT_Secret);
    // Attach the user information from the token to the request object
    req.user = data.user;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, send an unauthorized response
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
}

module.exports = fetchuser;
