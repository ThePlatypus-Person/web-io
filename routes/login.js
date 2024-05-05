const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CustomAPIError = require('../utils/custom-error');

router.get('/', (req, res) => {
    res.render('pages/login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomAPIError(400, 'Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomAPIError(401, 'Account does not exist');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomAPIError(401, 'Incorrect password');
    }

    const token = user.createJWT();
    res.cookie('token', `Bearer ${token}`);
    res.status(200).json({ user: { 
        name: user.name, 
        role: user.role
    }, token });
});

module.exports = router;
