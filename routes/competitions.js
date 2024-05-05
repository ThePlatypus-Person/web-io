const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const newName = `${new Date().getTime()}-${file.originalname}`;
        cb(null, newName);
    }
})
const upload = multer({ storage: storage });
const Competition = require('../models/Competition');
const User = require('../models/User');
const router = express.Router();


router.get('/', async (req, res) => {
    
    res.status(200).json({ msg: "Hello" });
    // res.render('pages/admin-dashboard', { userList: userList });
});


router.post('/', upload.single('image'), async (req, res) => {
    console.log(req.file);
    console.log(req.body.name);

    // Create check if it already exist or not
    const item = await Competition.findOne({ name: req.body.name });
    console.log(`Item Found: ${item}`);
    if (item) {
        const itemImgPath = path.resolve('public', item.img);

        if (req.file) {
            fs.unlink(itemImgPath, (err) => {
                if (err) {
                    console.log("File Doesn't Exist")
                    console.log(err);
                } else {
                    console.log(`Removed File: ${item.img}`);
                }
            });
        }

        const newImgPath = req.file === undefined ? item.img : req.file.filename;
        const competition = await Competition.findOneAndReplace({
            _id: item._id
        }, { 
            ...req.body,
            img: newImgPath
        }, {
            new: true
        });

        console.log(competition);
        res.status(200).redirect('/dashboard/competitions');
    } else {
        await Competition.create({ 
            ...req.body,
            img: `${req.file.filename}`
        });

        res.status(200).redirect('/dashboard/competitions');
    }
});

router.delete('/', async (req, res) => {
    console.log('deleting...');
    console.log(req.body);
    const item = await Competition.findOne({ _id: req.body.id });
    console.log(`Item Found: ${item}`);
    if (item) {
        const itemImgPath = path.resolve('public', item.img);

        fs.unlink(itemImgPath, (err) => {
            if (err) {
                console.log("File Doesn't Exist")
                console.log(err);
            } else {
                console.log(`Removed File: ${item.img}`);
            }
        });

        await Competition.findOneAndDelete({
            _id: item._id
        });
        res.status(200).redirect('/dashboard/competitions');
    }
});

router.post('/members', async (req, res) => {
    const item = await Competition.findOne({ name: req.body.name });
    const { id, name, email } = req.body.member;

    if (item) {

        const compe = await Competition.findOneAndUpdate({
            _id: item._id
        }, {
            $addToSet: {
                participants: email
            }
        });

        const user = await User.findOneAndUpdate({
            _id: id
        }, {
            $addToSet: {
                competitions: compe.name
            }
        });
       
        res.status(200).json({ 
            competition: compe,
            user: user
        });
    } else {
        res.status(404).json({ msg: 'Not Found' });
    }
});

router.delete('/members', async (req, res) => {
    const item = await Competition.findOne({ name: req.body.name });
    const { id, name, email } = req.body.member;

    if (item) {

        const compe = await Competition.findOneAndUpdate({
            _id: item._id
        }, {
            $pull: {
                participants: email
            }
        });

        const user = await User.findOneAndUpdate({
            _id: id
        }, {
            $pull: {
                competitions: compe.name
            }
        });
       
        res.status(200).redirect('/dashboard/user-competitions');
    } else {
        res.status(404).json({ msg: 'Not Found' });
    }
});


module.exports = router;
