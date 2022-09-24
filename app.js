const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article",articleSchema);

//////////////////////////////////////Request Targeting All Article/////////////////////////////////////////

app.route("/articles")
  .get(function(req,res){
    Article.find({}, function(err, foundItems){
      if(err)
        res.send(err);
      else{
        res.send(foundItems);
      }
    });
  })
  .post(function(req,res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if(err)
        console.log(err);
      else
        res.send("Successfully Added Article");
    });
  })
  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(err)
        console.log(err);
      else
        res.send("All Articles are Deleted");
    });
  })
;

//////////////////////////////////////Request Targeting Specific Article/////////////////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req,res){
      Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        if(err)
          console.log(err);
        else
          res.send(foundArticle);
      });
    })
  .put(function(req,res){
    Article.updateOne({title: req.params.articleTitle},{title: req.body.title,content: req.body.content}, function(err){
      if(err)
        console.log(err);
      else
        res.send("Article Updated");
    });
  })
  .patch(function(req,res){
    Article.updateOne({title: req.params.articleTitle},{$set: req.body}, function(err){
      if(err)
        console.log(err);
      else
        res.send("Article Patch Updated");
    });
  })
  .delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle}, function(err, result){
      if(err)
        console.log(err);
      else
        res.send("Article deleted");
    });
  })
;

app.listen(3000,function(){
  console.log("Server started on port : "+(3000));
});
