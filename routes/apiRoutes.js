const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");
module.exports = app => {
  // A GET route for scraping the USA-Today website
  app.get("/api/scrape", (req, res) => {
    // First, we grab the body of the html with axios
    axios.get("https://www.usatoday.com/news/").then(response => {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      const $ = cheerio.load(response.data);

      // Now, we grab every .hgpm-link class, and do the following:
      $(".hgpm-link").each((i, element) => {
        // Save an empty result object
        const result = {};

        // Add the title, href, summary, and imageUrl, after checking that they exist (i.e. are not undefined) of every link, and save them as properties of the result object
        let unsplitUrl = $(element)
          .children("span.hgpm-grid-wrap")
          .children("img.hgpm-image")
          .attr("src");

        if (unsplitUrl) {
          result.link = "https://www.usatoday.com" +
            $(element)
              .attr("href");

          result.title = $(element)
            .children("span.hgpm-list-wrap")
            .children("span.hgpm-list-text")
            .children("span.hgpm-list-hed")
            .text();

          result.summary = $(element)
            .children("span.hgpm-list-wrap")
            .children("span.hgpm-list-text")
            .children("span.hgpm-back-listview-text")
            .text();

          let splitUrl = $(element)
            .children("span.hgpm-grid-wrap")
            .children("img.hgpm-image")
            .attr("src").split("?");

          result.imageUrl = splitUrl[0];

          console.log(result);
          //Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        }
      });

      // Send a message to the client
      res.json({msg:"Scrape Complete"});
    });
  });

  // Route for getting all Articles from the db
  app.get("/api/articles", (req, res) => {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route for getting all saved articles from the db
  app.get("/api/saved-articles", (req, res) => {
    db.Article.find({ saved: true })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route for finding one article by id, populated with notes
  app.get("/api/articles/:id", (req, res) => {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("notes")
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route for posting notes to articles
  app.post("/api/articles/:id", (req, res) => {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(dbNote => db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id }, saved: true }, { new: true }))
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route for updating an article to being saved
  app.put("/api/articles/:id", (req, res) => {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route for updating an article to being not saved
  app.put("/api/saved-articles/:id", (req, res) => {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route for deleting notes
  app.delete("/api/notes/:id", (req, res) => {
    db.Note.deleteOne({ _id: req.params.id })
      .then(dbNote => res.json(dbNote))
      .catch(err => res.json(err));
  });

  // Route for deleting articles
  app.delete("/api/articles", (req, res) => {
    db.Article.deleteMany({ saved: false })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });
};
