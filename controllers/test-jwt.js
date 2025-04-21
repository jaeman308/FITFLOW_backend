const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/sign-token', (req, res) => {
    const user =  {
        _id: 1,
        username: 'test',
        password: 'test',
        email: 'test@example.com',
        firstName: 'test'
    };
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

router.post('/verify-token', (req, res) => {
    try {
        const token = req.body.token; // Extract token from request body
        if (!token) {
            return res.status(400).json({ error: "Token is required in the request body" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ decoded });
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
});

module.exports = router;
