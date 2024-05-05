const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.render('pages/register');
});

router.post('/', async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.cookie('token', `Bearer ${token}`);
    res.status(200).json({ user: { 
        name: user.name, 
        role: user.role
    }, token });
});


module.exports = router;
