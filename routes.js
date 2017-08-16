const express = require("express");
const path    = require("path");
const User    = require(path.resolve(__dirname, "models", "user"));

const router = express.Router();

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get("/", (req, res, next) => {
  User.find({}, null, { sort: { createdAt: "descending" } }, (err, users) => {
    if (err) { return next(err); }
    res.render("index", { users: users });
  });
});

module.exports = router;
