const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');

const { talksList } = require('../utils/data');
let competitions;
let competitionPaths;

router.get('/', async (req, res) => {
    const authHeader = req.cookies.token;
    const isLoggedIn = authHeader && authHeader.startsWith('Bearer ');
        competitions = await Competition.find({});
        competitionPaths = competitions.map(item => item.path);

    res.render('pages/main', { 
        competitions: competitions, 
        talks: talksList, 
        isLoggedIn: isLoggedIn
    });
});

router.get('/:path', async (req, res, next) => {
    const { path } = req.params;
    const authHeader = req.cookies.token;
    const isLoggedIn = authHeader && authHeader.startsWith('Bearer ');

    if (competitionPaths && !competitionPaths.includes(path)) {
        next();
    } else {
        if (!competitions) return;
        const data = competitions.find(item => item.path === path);

        res.render('pages/information', { 
            title: data.name, 
            desc: data.desc,
            img: data.img
        });
    }
});


module.exports = router;
