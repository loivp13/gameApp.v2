const express = require("express");
const router = express.Router();
const handleUsers = require("./Actions/HandleUsers");
const passport = require("passport");
const isLogin = require("../routes/Actions/middleWares/isLogin");
const isNotLogin = require("../routes/Actions/middleWares/isNotLogin");
const SearchFunction = require("./Actions/SearchFunction");
const Cart = require("../models/cart");
const giantBombDataBase = require("../models/giantBombGamesDataBase");

// =========================================================
// ==================== IS LOGGED IN =======================
// =========================================================
router.get("/profile", isLogin, async function(req, res, next) {
  let tab1 = 1,
    tab2 = 2,
    tab3 = 3;
  try {
    res.locals.username = req.user.username;
    let userMessage = req.flash("userError");
    let successMessage = req.flash("success");
    let hasMessage = successMessage.length || userMessage.length;
    let addToList = req.query.addGame;
    let searchTerm = req.query.name;
    let cart = req.session.cart;
    let searchedDataArray = await giantBombDataBase;

    //search for null and undefined/ add pricing
    let chunkedArray = searchedDataArray.results[0].map(object => {
      if (!object.platforms) {
        object.platforms = [{ abbreviation: "TBA" }];
      }
      if (!object.deck) {
        object.deck = "No information as of this time";
      }
      if (!object.original_release_date) {
        object.original_release_date = "TBA";
      }
      console.log(object.original_release_date);
      if (object.original_release_date !== "TBA") {
        object.price = Math.abs(
          Math.round(
            60 - (2019 - object.original_release_date.slice(0, 4)) * 2.75
          )
        );
      } else {
        object.price = 0;
      }
      return object;
    });

    let tabs = {
      tab1,
      tab2,
      tab3
    };
    res.render("profile", {
      chunkedArray,
      addToList,
      csrfToken: req.csrfToken(),
      userMessage,
      hasMessage,
      cart,
      successMessage,
      tabs
    });
  } catch (e) {
    next(e);
  }
});

router.get("/profile/:page", isLogin, async function(req, res, next) {
  let page = JSON.parse(req.params.page) || 1;
  let tab1, tab2, tab3;
  if (page === 1) {
    tab1 = 1;
    tab2 = 2;
    tab3 = 3;
  } else if (page === 6) {
    tab1 = 4;
    tab2 = 5;
    tab3 = 6;
  } else {
    tab1 = page - 1;
    tab2 = page;
    tab3 = page + 1;
  }
  try {
    res.locals.username = req.user.username;
    let userMessage = req.flash("userError");
    let successMessage = req.flash("success");
    let hasMessage = successMessage.length || userMessage.length;
    let addToList = req.query.addGame;
    let searchTerm = req.query.name;
    let cart = req.session.cart;
    let searchedDataArray = await SearchFunction(searchTerm);

    //search for null and undefined/ add pricing
    let chunkedArray = searchedDataArray.results[0].map(object => {
      if (!object.platforms) {
        object.platforms = [{ abbreviation: "TBA" }];
      }
      if (!object.deck) {
        object.deck = "No information as of this time";
      }
      if (!object.original_release_date) {
        object.original_release_date = "TBA";
      }
      object.price = Math.abs(
        Math.round(
          60 - (2019 - object.original_release_date.slice(0, 4)) * 2.75
        )
      );
      return object;
    });

    console.log(chunkedArray);
    let tabs = {
      tab1,
      tab2,
      tab3
    };
    res.render("profile", {
      chunkedArray,
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

//User delete 1 item from wish list
router.post("/profile/delete", isLogin, function(req, res, next) {
  let deleteGameObj = JSON.parse(req.body.deleteGame);
  let cart = new Cart(req.session.cart);
  cart.delete(deleteGameObj);
  req.flash("success", "Deleted item");
  req.session.cart = cart;
  res.redirect("/users/profile");
});

//User delete all
router.delete("/profile/removeAll", function(req, res, next) {
  delete req.session.cart;
  res.redirect("/users/profile");
});

//User adding to wish list
router.post("/profile", isLogin, function(req, res, next) {
  let cart = new Cart(
    //accepts session.cart || empty object
    req.session.cart ? req.session.cart : {}
  );
  cart.add(JSON.parse(req.body.addGame));
  req.session.cart = cart;
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
