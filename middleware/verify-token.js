const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is required" });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Invalid token format. Use 'Bearer <token>'" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Token not found" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        decoded._id = new mongoose.Types.ObjectId(decoded._id);
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;
