const db = require("../models");

module.exports = app => {

  // Load home page
  app.get("/", (req, res) => {
    db.Article.find({})
      .then(dbArticle => res.render("home", {
        Article: dbArticle
      }))
      .catch(err => res.json(err));
  });
  
  // Load saved articles page
  app.get("/saved-articles", (req, res) => {
    db.Article.find({saved: true})
      .then(dbArticle => res.render("saved-articles", {
        Article: dbArticle
      }))
      .catch(err => res.json(err));
  });

  // Load notes page
  app.get("/articles/:id", (req, res) => {
    db.Article.find({_id: req.params.id})
      .populate("notes")
      .then(dbArticle => res.render("read-note", {
        Article: dbArticle,
        Note: dbArticle[0].notes
      }))
      .catch(err => res.json(err));
  });

  // Render 404 page for any unmatched routes
  app.get("*", (req, res) => {
    res.render("404", {});
  });
};