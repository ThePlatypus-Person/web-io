const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    console.log(user);

    res.status(200).render('../views/pages/edit-account-form', {
        user: user,
        apiPath: `/users/${id}`
    });
});

router.get('/edit-name/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    res.status(200).render('../views/pages/change-name-form', {
        user: user,
        endpointAPI: `/users/edit-name/${user._id}`,
    });
});

router.post('/edit-name/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOneAndUpdate({ 
        _id: id 
    }, {
        name: req.body.name
    });

    res.status(200).redirect('/dashboard/settings');
});

router.get('/edit-password/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    res.status(200).render('../views/pages/change-password-form', {
        user: user,
        endpointAPI: `/users/edit-password/${user._id}`,
    });
});

router.post('/edit-password/:id', async (req, res) => {
    const { id } = req.params;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.newPass, salt);

    const user = await User.findOneAndUpdate({ 
        _id: id 
    }, {
        password: password
    });

    const token = user.createJWT();
    res.cookie('token', `Bearer ${token}`);
    res.status(200).json({ 
        msg: "success editing password",
        user: user,
    });
});


router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOneAndUpdate({ _id: id }, {
        role: req.body.role
    });
    console.log(user);

    res.status(200).redirect('/dashboard/accounts');
});

router.delete('/', async (req, res) => {
    const user = await User.findOneAndDelete({ _id: req.body.id });
    console.log(`User Deleted: ${user}`);

    res.status(200).redirect('/dashboard');
});

module.exports = router;
