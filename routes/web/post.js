const express = require('express');

const ensureAuthenticated = require('../../auth/auth').ensureAuthenticated;


const router = express.Router();

router.use(ensureAuthenticated)

router.get('/', (req, res) => {
    res.render('articles/post/posts')
})




module.exports = router;