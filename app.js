let express=require('express');
let path=require('path');
let app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//STATIC FOLDER
app.use(express.static(path.join(__dirname,'public')));

app.listen(3000,function(){
    console.log("listening on port 3000...");
});


//Mongoose Config
let mongoose =require('mongoose');
mongoose.connect('mongodb://localhost/articlesDb');
let db=mongoose.connection;

db.on('error',function(err){
    console.log(err);
});

db.once('open',function(){
    console.log("Connected to mongodb !!!");
});

let Article = require('./models/article');


//Body Parser Config
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Route to display all Articles (Index Route)
app.get('/',function(req,res){
    Article.find({},function(err,articles){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                title:'Index Page',
                articles:articles
            });
        }
    });
});

//View Single Article
app.get('/view/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('view_article',{
            article:article
        });
    });
})

//Add Article
//GET route
app.get('/add',function(req,res){
    res.render('add_article');
});


//POST route
app.post('/add',function(req,res){
    let article=new Article();
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            res.redirect('/');
        }
    });
});

//Edit Route

//get route
app.get('/edit/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('edit_article',{
            article:article
        });
    });
});

//Post route
app.post('/update/:id',function(req,res){
    let article = {};
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    let query={_id:req.params.id};

    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            res.redirect('/');
        }
    });
});

//Delete Route
app.delete('/delete/:id',function(req,res){
    let query={_id:req.params.id};

    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});
