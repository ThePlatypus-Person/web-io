require('dotenv').config()

const path = require('path');
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/main');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT;

app.listen(port);
console.log(`Listening on port ${port}`);
