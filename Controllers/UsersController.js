const { model } = require('mongoose');
const User = require('../Models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register.ejs');
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({username});
        if(existingUser) {
            req.flash('error', 'User already exists. please choose a different username');
            return res.redirect('/register');
        }

        const user = new User({ username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to yelpcamp');
            res.redirect('/campgrounds');
        });   
    } catch(e) { 
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.Login = (req, res) => {
        const redirectUrl = res.locals.returnToUrl || '/campgrounds';
        req.flash('success', 'Welcome Back!');
        res.redirect(redirectUrl);
};

module.exports.Logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}