const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(token, 'saikh');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
