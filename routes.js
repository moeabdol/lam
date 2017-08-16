const express       = require("express");
const passport      = require("passport");
const path          = require("path");
const User          = require(path.resolve(__dirname, "models", "user"));

const router = express.Router();

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors      = req.flash("error");
  res.locals.infos       = req.flash("info");
  next();
});

router.get("/", (req, res, next) => {
  User.find({}, null, { sort: { createdAt: -1 } }, (err, users) => {
    if (err) { return next(err); }
    res.render("index", {
      users: users
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
  successRedirect:  "/",
  failureRedirect:  "/login",
  failureFlash:     true
}));

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, (err, user) => {
    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }

    const newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);

  });
}, passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash:    true
}));

router.get("/users/:username", (req, res, next) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err)   { return next(err); }
    if (!user) { return next(404); }
    res.render("profile", {
      user: user,
      currentUserIsOwner: () => {
        return res.locals.currentUser &&
          (res.locals.currentUser.id === user.id);
      }
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
