var  express       = require("express"),
     bodyParser    = require("body-parser"),
     mongoose      = require("mongoose"),
     app           = express();     


mongoose.connect("mongodb://127.0.0.1:27017/Blog_app", function(err) {
  (err)? console.error(err, 'Error Connecting to Database!') :
    console.log('Database Connected Successfully. Build Safely!')
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//default view engines
app.set("view engine", "ejs"); 



// MONGOOSE/MODEL SCHEMA
var blogSchema = new mongoose.Schema({
  title:   String,
  image:   String,
  body :   String,
  created: { type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);













//RESTFUL ROUTES
app.get("/", function(req, res){
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
      (err)? console.log(err) : res.render("index", {blogs: blogs})
   })
});























app.listen(3000, function(){
    console.log("Blog app started");
});


