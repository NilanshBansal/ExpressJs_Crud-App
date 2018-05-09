const express= require('express');
const router = express.Router();
let Article = require('../models/article');

//Add Article
//GET route
router.get('/add',function(req,res){
    res.render('add_article');
});


//POST route
router.post('/add',function(req,res){

    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //Get Errors
    let errors=req.validationErrors();

    if(errors){
        res.render('add_article',{
            errors:errors
        });
    }
    else{
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
                req.flash('success','Article added');            
                res.redirect('/');
            }
        });
    } 
});

//Edit Route

//get route
router.get('/edit/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('edit_article',{
            article:article
        });
    });
});

//Post route
router.post('/update/:id',function(req,res){
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
            req.flash('success','Article Updated');            
            res.redirect('/');
        }
    });
});

//Delete Route
router.delete('/delete/:id',function(req,res){
    let query={_id:req.params.id};

    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        req.flash('danger','Article deleted!')
        res.send('Success');
    });
});

//View Single Article
router.get('/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('view_article',{
            article:article
        });
    });
})

module.exports=router;