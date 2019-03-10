const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");
module.exports = app => {
  // A GET route for scraping the echoJS website
  app.get("/api/scrape", (req, res) => {
    // First, we grab the body of the html with axios
    axios.get("https://www.usatoday.com/news/").then(response => {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      const $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".hgpm-link").each((i, element) => {
        // Save an empty result object
        const result = {};

        // Add the text and href of every link, and save them as properties of the result object
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
      res.send("Scrape Complete");
    });
  });

};