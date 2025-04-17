const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const catchAsync = require('../Utils/CatchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

const userController = require('../Controllers/UsersController');

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.register));

router.route('/login')
    .get(userController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.Login);

router.get('/logout', userController.Logout);

module.exports = router;