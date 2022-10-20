const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const Article = require('../models/article')
const articleRouter = require('../routes/articles')
//const routes = require('../routes/routes')
const methodOverride = require('method-override')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')


let setUpPassport = require('../setuppassport')


//----- Settings
const port = process.env.PORT || 3000
//set template engine
app.set('view engine', 'ejs')
//Uniendo las vistas
app.set("views/articles", path.join(__dirname, "views/articles"));
// Requiriendo la carpeta public
app.use('/public/', express.static('./public/'))


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "asdfasdf!@afd.sf-sdfsdf",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize()); // initialize passport module
app.use(passport.session());
app.use(flash());


//----- Middlewares
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
const ensureAuthenticated = require('../auth/auth').ensureAuthenticated;


// Ruta principal Blog 
app.get('/blog', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: "desc"
    }).limit(10)
    res.render('articles/home/index', { articles: articles })
})


// MongoDB connection
// mongoose   
//     .connect(process.env.MONGODB_URI)
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error(err))
setUpPassport();

//----- Routes
app.use('/articles', articleRouter);
app.use('/', require('../routes/web'));
app.use('/api', require('../routes/api'));


app.listen(port,
    () => console.log(`Server started on port ${port}`)
)