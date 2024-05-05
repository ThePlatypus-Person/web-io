const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CustomAPIError = require('../utils/custom-error');

async function auth(req, res, next) {
    const authHeader = req.cookies.token;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        next(new CustomAPIError(401, 'Authentication Invalid'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name, role: payload.role };
        next();
    } catch (err) {
        next(new CustomAPIError(401, 'Authentication Invalid'));
    }
}

module.exports = auth;
