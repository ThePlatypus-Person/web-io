const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Competition = require('../models/Competition');

router.get('/', async (req, res) => {
    const navLinks = getLinks(req.user.role);

    res.render('pages/dashboard', { 
        user: req.user,
        navLinks: navLinks, 
        userList: undefined,
        competitions: undefined,
        settings: false,
        userCompetitions: undefined,
        competitionNames: undefined,
    });
});

router.get('/accounts', async (req, res) => {
    const navLinks = getLinks(req.user.role);

    const userList = await User.find({});

    res.render('pages/dashboard', { 
        user: req.user,
        navLinks: navLinks, 
        userList: userList,
        competitions: undefined,
        settings: false,
        userCompetitions: undefined,
        competitionNames: undefined,
    });
});

router.get('/competitions', async (req, res) => {
    const navLinks = getLinks(req.user.role);
    const competitionList = await Competition.find({});

    res.render('pages/dashboard', { 
        user: req.user,
        navLinks: navLinks, 
        userList: undefined,
        competitions: competitionList,
        settings: false,
        userCompetitions: undefined,
        competitionNames: undefined,
    });
});

router.get('/user-competitions', async (req, res) => {
    const navLinks = getLinks(req.user.role);
    const user = await User.findOne({ _id: req.user.userId });
    const competitionNames = await Competition.find({}).select('name');
    console.log(user);

    res.render('pages/dashboard', { 
        user: req.user,
        navLinks: navLinks, 
        userList: undefined,
        competitions: undefined,
        settings: false,
        userCompetitions: user,
        competitionNames: competitionNames,
    });
});

router.get('/settings', async (req, res) => {
    const navLinks = getLinks(req.user.role);
    const user = await User.findOne({ _id: req.user.userId });

    console.log(user);
    res.render('pages/dashboard', { 
        user: user,
        navLinks: navLinks, 
        userList: undefined,
        competitions: undefined,
        settings: true,
        userCompetitions: undefined,
        competitionNames: undefined,
    });
});

router.get('/logout', (req, res) => {
    console.log('token removed');
    res.status(200).cookie('token', '');
    res.end();
});

router.get('/:path', async (req, res, next) => {
    const { path } = req.params;
    const competitionList = await Competition.find({});
    const competitionPaths = competitionList.map(item => item.path);

    if (competitionPaths && !competitionPaths.includes(path)) {
        next();
    } else {
        const data = competitionList.find(item => item.path === path);

        res.render('pages/competition-form', { 
            title: "Edit Competition", 
            data: data,
            competitionAPI: '/competitions',
        });
    }
});

router.get('/competitions/add', (req, res) => {
    const data = {
        id: null,
        name: null,
        path: null,
        desc: null,
        img: null,
        id: null
    };

    res.render('pages/competition-form', { 
        title: "Add Competition", 
        data: data,
        competitionAPI: '/competitions',
    });
});


function getLinks(role) {
    if (role === 'admin')
        return [{
            name: 'Competition List',
            path: '/dashboard/competitions'
        }, {
            name: 'Account List',
            path: '/dashboard/accounts'
        }, {
            name: 'Account Settings',
            path: '/dashboard/settings'
        }];

    return [{
        name: 'My Competitions',
        path: '/dashboard/user-competitions'
    }, {
        name: 'Account Settings',
        path: '/dashboard/settings'
    }];
}

module.exports = router;
