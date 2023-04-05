const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_TOKEN;

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        jwt.verify(token, jwtKey, (err, payload) => {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }else{
            next();
            }
        })
    }else{
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
}