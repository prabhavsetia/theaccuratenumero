const jwt = require('jsonwebtoken');

const JWT_Secret =process.env.JWT_Secret;
const fetchuser = (req, res, next) => {
    //get the user from jwt token and id to req object
    const token = req.header('authtoken');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_Secret);
        console.log(JWT_Secret);
        console.log(data);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }

}

module.exports = fetchuser;