const express = require("express");
const router = express.Router();
const handleUsers = require("./Actions/HandleUsers");
const passport = require("passport");
const isLogin = require("../routes/Actions/middleWares/isLogin");
const isNotLogin = require("../routes/Actions/middleWares/isNotLogin");
const SearchFunction = require("./Actions/SearchFunction");
const Cart = require("../models/cart");

// =========================================================
// ==================== IS LOGGED IN =======================
// =========================================================
router.get("/profile", isLogin, async function(req, res, next) {
  try {
    res.locals.username = req.user.username;
    let userMessage = req.flash("userError");
    let successMessage = req.flash("success");
    let hasMessage = successMessage.length || userMessage.length;
    let addToList = req.query.addGame;
    let searchTerm = req.query.name;
    let cart = req.session.cart;
    let searchedDataArray = await SearchFunction(searchTerm);
    res.render("profile", {
      searchedDataArray,
      addToList,
      csrfToken: req.csrfToken(),
      userMessage,
      hasMessage,
      cart,
      successMessage
    });
  } catch (e) {
    next(e);
  }
});

//User deletes from wish list
router.post("/profile/delete", isLogin, function(req, res, next) {
  let deleteGameObj = JSON.parse(req.body.deleteGame);
  let cart = new Cart(req.session.cart);
  cart.delete(deleteGameObj);
  req.flash("success", "Deleted item");
  req.session.cart = cart;
  res.redirect("/users/profile");
});

router.post("/profile/removeAll", function(req, res, next) {});

//User adding to wish list
router.post("/profile/:username", isLogin, function(req, res, next) {
  let cart = new Cart(
    //accepts session.cart || empty object
    req.session.cart ? req.session.cart : {}
  );
  cart.add(JSON.parse(req.body.addGame));
  req.session.cart = cart;
  console.log(cart.items);
  req.flash("success", "Added Item");
  res.redirect("/users/profile");
});

//user logging out
router.get("/logout", function(req, res, next) {
  req.logout();
  res.redirect("/");
});

// =========================================================
// ==================== IS NOT LOGGED IN ===================
// =========================================================
router.use("/", isNotLogin, function(req, res, next) {
  next();
});

/* Account login page */
router.get("/login", function(req, res, next) {
  let loginErrors = req.flash("loginErrors");
  let signupErrors = req.flash("signupErrors");
  let hasLoginErr = loginErrors.length > 0;
  let hasSignupErr = signupErrors.length > 0;
  res.render("login", {
    csrfToken: req.csrfToken(),
    loginErrors,
    hasLoginErr,
    signupErrors,
    hasSignupErr
  });
});

// User attempt to login
router.post(
  "/login",
  passport.authenticate("local.signin", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

//User attempt to register
router.post(
  "/register",
  passport.authenticate("local.signup", {
    successRedirect: "/users/profile ",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

module.exports = router;
