var express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require("mongoose"),
    app = express();


mongoose.connect("mongodb://127.0.0.1:27017/Blog_app", (err) => {
    (err) ? console.error(err, 'Error Connecting to Database!'):
        console.log('Database Connected Successfully. Build Safely!')
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//default view engines
app.set("view engine", "ejs");



// MONGOOSE/MODEL SCHEMA
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Tester Blog",
//     image: '/images/3.jpg',
//     body: "Hello just testing out this blog!!!"
// })





//RESTFUL ROUTES
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//index Route
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        (err) ? console.log(err): res.render("index", { blogs: blogs })
    })
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render("new")
});

// CREATE ROUTE
app.post('/blogs', (req, res) => {
    //create new blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new')
        }
        res.redirect('/blogs')
    });
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        (err) ? res.redirect('/blogs'): res.render('show', { blog: foundBlog });

    })
})

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        (err) ? res.redirect('/blogs'): res.render('edit', { blog: foundBlog });
    });
});

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        (err) ? res.redirect('/blogs'): res.redirect('/blogs/' + req.params.id);
    });
})


// DESTROY ROUTE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        (err) ? res.redirect('/blogs'): res.redirect('/blogs');
    });
})


//Setup the port for the server to listen on ==> port 3000
const PORT = process.env.PORT || 3000;

// Start the server, listening on port = PORT
app.listen(PORT);