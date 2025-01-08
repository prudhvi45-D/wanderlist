
const User = require('../models/user');
const passport = require('passport');

module.exports.signupForm = (req, res) => {
    res.render('users/signup');
};

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('users/login');
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};

module.exports.login = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || '/listings';
    req.flash('success', 'Welcome back to Wanderlust!');
    res.redirect(redirectUrl);
};
