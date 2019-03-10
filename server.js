const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoUSAYesterday";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, () => console.log(`Listening on port ${PORT}.  Visit http://localhost:${PORT}/ in the browser.`));

module.exports = app;
