const express = require("express");

const router = express.Router();


//TODO:: add in error and info 

router.use(function(req, res, next){
    res.locals.currentUser = req.user; // add this re.user, at the currentUser locals
                                       //in this locals have the current user
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    
    next();
})

router.use("/", require("./home"));
router.use("/post", require("./post"));


module.exports = router;