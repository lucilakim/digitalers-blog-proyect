const mongoose = require('mongoose')
const {marked} = require('marked')
const slugify = require('slugify')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);
const htmlPurify = dompurify(new JSDOM().window);
//const mongoosePaginate = require('mongoose-paginate-v2')


const articleSchema = new mongoose.Schema(
    {
        title: { 
            type: String,
            require: true,
        },
        author:{
            type: String,
            required:true,
        },
        description: {
            type: String,
        },
        markdown: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        slug: {
            type: String,
            required: true,
            unique: true // contruye indices unicos, que no haya otro igual, lo que va en la url
        },
        img:{
            type:String,
            default: "placeholde.jpg"
        },
        sanitizedHtml: {
            type: String,
            required: true
        },
        // url:{
        //     type: String
        // }
    },
    {
        versionKey: false
    }
)

// Middleware .pre()

articleSchema.pre('validate', function (next){
    //check if there is a title
    if(this.title){
        this.slug = slugify(this.title, {lower: true, strict: true}) 
    }
    //check if there is a markdown
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    //check if there is a description
    if(this.description){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next();
})

//articleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Article', articleSchema)