// Blog routes
const express = require('express')
const Article = require("../models/article")
const router = express.Router()
const multer = require('multer')


//define storage for the images
const storage = multer.diskStorage({
    //destination for files
    destination: function (req, file, callback) {
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

//upload parameters for multer 
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});


router.get('/new', (req, res) => { //este para leer llosa datos de la ruta
    res.render('articles/form/new', { article: new Article() })
})

router.get('/articles', (req, res) => {
    res.render('articles/home/articles')
})

// Ruta para renderizar el Articulo a Editar
router.get('/edit/:id', async (req, res, next) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/form/edit', { article: article });
})



// Obtenemos el Articulo con Slug a aplicar
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/') // si no encuentra slug o esta mal me lleva a la home
    res.render('articles/home/show', { article: article })
})


//Creamos Nuevo Articulo
router.post('/', upload.single('image'), async (req, res, next) => {
    //console.log(req.file);
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

// Editamos Articulo x ID
router.put('/:id', upload.single('image'), async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))


//que guarde y nos rediriga, a la home o nos muestre el articulo, 

//Eliminar Articulo
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    //poner un modal que diga eliminado corectamente 
    //o una funcion si quiere eliminar este articulo cancelar y eliminarrealmentequiere eliminar
    res.redirect('/blog')
})


router.get('/sarasa/generate-fake-data', async (req, res) => {
    console.log('lsakjdfljasdlfkjaslkfdjasldkfjalksd');
    for (let i = 0; i < 90; i++) {
        let article = new Article({
            title: i,
            author: i,
            description: i,
            markdown: i,
            img: "1665773570389imagen.png"
        });

        await article.save(err => {
            if (err) { return next(err); }
        });

    }
    res.render('articles/home/show', { article: {} })
});



//Ruta para generar toda nuestra paginacion de productos
router.get('/', (req, res, next) => {
    let perPage = 9; // cuantos quiero por pagina
    let page = req.query.page || 1; //la pagina que solicita el usuario, si no manda nada es la 1

    Article // de pagina de articulos 
        .find({}) //quiero buscar todos los articulos
        .skip((perPage * page) - perPage) // quiero saltarme, los que no estan en la pagina 
        .limit((perPage)) // cuantas paginas quiero renderizar en la pagina, asi 9
        .exec(((err, articles) => { // cuando ejecuto puedo tener un error o los articulos
            Article.count((err, count) => {
                if (err) return next(err)
                res.render('articles/home/articles', {
                    articles,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
            })
        }))
})


//Guardar Articulo y redireccionar
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.author = req.body.author
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.img = req.file.filename
        //article.profileImgUrl =
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}


module.exports = router;