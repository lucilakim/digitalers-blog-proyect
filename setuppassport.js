const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

let User = require("./models/user");

module.exports = function () {
    //turns a user object into an id
    passport.serializeUser(function (user, done) {
        //serializing the user
        done(null, user._id);
    });
    //turns the id into a user object
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use("login", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { // if user doesnt exist
                return done(null, false, { message: "No user has that Email!" });
            }
            user.checkPassword(password, function (err, isMatch) { // checking the password
                if (err) { return done(err); } // if error, sale
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid password" });
                }
            });
        });
    }));



}