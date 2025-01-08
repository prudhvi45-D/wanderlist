// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const wrapasync = require('../utils/wrapasync');
const passport = require('passport');
const { saveRedirectUrl } = require("../middlware");
const authController = require("../controallers/user.js");


// Signup routes
router.route('/signup')
    .get(authController.signupForm)
    .post(wrapasync(authController.signup));

// Login routes
router.route('/login')
    .get(authController.loginForm)
    .post(saveRedirectUrl, 
        passport.authenticate('local', { 
            failureRedirect: '/login', 
            failureFlash: true 
        }),
        authController.login
    );

// Logout route
router.get('/logout', authController.logout);

module.exports = router;