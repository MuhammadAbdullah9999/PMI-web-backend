const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
};

module.exports = {
    authenticateJWT
};
