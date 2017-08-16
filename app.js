const express    = require("express");
const mongoose   = require("mongoose");
const path       = require("path");
const bodyParser = require("body-parser");
const session    = require("express-session");
const flash      = require("connect-flash");
const passport   = require("passport");
const hbs        = require("express-handlebars");
const routes     = require(path.resolve(__dirname, "routes"));

const app = express();
const setupPassport = require(path.resolve(__dirname, "setuppassport"));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test", { useMongoClient: true });

setupPassport();

app.set("port", process.env.PORT || 3000);

app.engine("hbs", hbs({
  extname:        "hbs",
  defaultLayout:  "layout",
  layoutDir:      path.resolve(__dirname, "views", "layouts"),
  paritialDir:    path.resolve(__dirname, "views", "partials")
}));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret:             "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave:             true,
  saveUninitialized:  true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(app.get("port"), () => {
  console.log("Server started on port ", app.get("port"));
});
