const express = require('express');
const passport = require('passport')

const ensureAuthenticated = require('../../auth/auth').ensureAuthenticated;

var User = require('../../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('articles/home/principal')
})

router.get('/home', (req, res) => {
    res.render('articles/home/home')
})


router.get('/works', (req, res) => {
    res.render('articles/home/works')
})

router.get('/biography', (req, res) => {
    res.render('articles/home/biography')
})

router.get('/login', (req, res) => {
    res.render('articles/home/login')
})


router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/home');
    });
});

router.post('/login', passport.authenticate("login", { //if login succes
    successRedirect: "/", // redirect to home
    failureRedirect: "/login", // if fail redirect to login 
    failureFlash: true
}));

router.get('/signup', (req, res) => {
    res.render('articles/home/signup')
})

router.post("/signup", function (req, res, next) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            req.flash("error", "There's already an account with this email");
            return res.redirect("/signup");
        }

        let newUser = new User({
            username: username,
            password: password,
            email: email
        });

        newUser.save(next);

    });

}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));


module.exports = router;