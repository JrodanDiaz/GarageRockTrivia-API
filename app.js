import express from "express";
import mongoose from "mongoose";


const PORT = 3000;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("Public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema
({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(async (req, res) => {
        const articles = await Article.find().exec();

        if(articles.length === 0){
            res.send("Sorry, no articles exist yet")
        } else {
            res.send(articles);
        }
    })

    .post(async (req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({title: title, content: content});
        await newArticle.save();
        res.send("Article successfully posted")
    })

    .delete(async (req, res) => {
        await Article.deleteMany();
        res.send("All articles deleted successfully");
    });

    app.route("/articles/:articleTitle")
        .get(async (req, res) => {
            const foundArticle = await Article.findOne({title: req.params.articleTitle});

            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title were found...");
            }
        })

        .put(async (req, res) => {
            const putArticle = await Article.findOneAndReplace(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content});

            if(putArticle){
                res.send("Article Successfully Replaced")
            } else {
                res.send("No articles matching that title were found...");
            }
        })

        .patch(async (req, res) => {
            const patchedArticle = await Article.findOneAndUpdate(
                {title: req.params.articleTitle},
                {$set: req.body}
            );

            if(patchedArticle){
                res.send("Article successfully Updated")
            } else {
                res.send("No articles matching that title were found...")
            }
        })

        .delete(async (req, res) => {
            const deletedArticle = await Article.findOneAndDelete({title: req.params.articleTitle});

            if(deletedArticle){
                res.send("Successfully deleted article");
            } else {
                res.send("No articles matching that title were found...")
            }
        });


console.log("Wait im goated");
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});
