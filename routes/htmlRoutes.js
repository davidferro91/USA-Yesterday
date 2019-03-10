module.exports = function(app) {

  // Load about me page
  app.get("/", function(req, res) {
    res.render("home", {});
  });
  
  // Load portfolio page
  app.get("/saved-articles", function(req, res) {
    res.render("saved-articles", {})
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404", {});
  });
};