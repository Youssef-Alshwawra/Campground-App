const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const courseRoutes = require('./Routes/Courses');
const reviewRoutes = require('./Routes/Reviews');
const userRoutes = require('./Routes/Users');

const session = require('express-session');
const flash = require('connect-flash');
const User = require('./Models/user');

mongoose.connect('mongodb://127.0.0.1:27017/EduPilot_dev1');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Connection err:"));
db.once("open", () => {
    console.log("database is connected sucessfuly");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded( { extended: true } ));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// should be after passport serialze and deserlize 
app.use( (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/courses', courseRoutes);
app.use('/courses/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.redirect('/courses');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use( (err, req, res, next) => {
    const { status = 500 } = err;
    if(!err.message) err.message = 'Oh No, Someting Went Wrong';
    res.status(status).render('error.ejs', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});