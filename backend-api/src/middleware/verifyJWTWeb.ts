const jwt = require('jsonwebtoken');

const verifyJWTWeb = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // Invalid token
            req.user = decoded.username;
            req.roles = decoded.roles;
            next();
        }
    );
}

module.exports = verifyJWTWeb;