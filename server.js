require('dotenv').config()
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/connect-db');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const registerRouter = require('./routes/register');
const mainRouter = require('./routes/main');
const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');
const competitionRouter = require('./routes/competitions');
const userRouter = require('./routes/users');
const authMiddleware = require('./middleware/auth');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', mainRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/dashboard', authMiddleware, dashboardRouter);
app.use('/users', authMiddleware, userRouter);
app.use('/competitions', competitionRouter);
// , authMiddleware

app.use(notFoundMiddleware);
//app.use(errorHandlerMiddleware);

const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

async function start() {
    try {
        await connectDB(mongoURI);
        app.listen(port, console.log(`Listening on port ${port}`));
    } catch (err) {
        console.log(err);
    }
}

start();
