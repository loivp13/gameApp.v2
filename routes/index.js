let express = require("express");
let router = express.Router();
let GiantBombGamesDataBase = require("../models/giantBombGamesDataBase");

/* GET home page. */
router.get("/", function(req, res, next) {
  try {
    let isLogin = res.locals.login;
    let addToList = req.query.addGame;

    //get database/ fix cases of null or undefined
    GiantBombGamesDataBase.then(db => {
      let chunkedArray = db.results[0].map(object => {
        if (!object.platforms) {
          object.platforms = [{ abbreviation: "TBA" }];
        }
        if (!object.deck) {
          object.deck = "No information as of this time";
        }
        return object;
      });
      return chunkedArray;
    }).then(chunkedArray => {
      let tabs = {
        tab1: 1,
        tab2: 2,
        tab3: 3
      };
      res.render("index", {
        title: "Express",
        addToList,
        csrfToken: req.csrfToken(),
        chunkedArray,
        isLogin,
        tabs
      });
    });
  } catch (e) {
    next(e);
  }
});
router.get("/pagination/:page", (req, res, done) => {
  let page = JSON.parse(req.params.page);
  let tab1, tab2, tab3;
  if (page === 1) {
    tab1 = 1;
    tab2 = 2;
    tab3 = 3;
  } else if (page === 6) {
    tab1 = 5;
    tab2 = 6;
    tab3 = 7;
  } else {
    tab1 = page - 1;
    tab2 = page;
    tab3 = page + 1;
  }

  try {
    let isLogin = res.locals.login;
    let addToList = req.query.addGame;

    //get database/ fix cases of null or undefined
    GiantBombGamesDataBase.then(db => {
      let chunkedArray = db.results[page].map(object => {
        if (!object.platforms) {
          object.platforms = [{ abbreviation: "TBA" }];
        }
        if (!object.deck) {
          object.deck = "No information as of this time";
        }
        return object;
      });
      return chunkedArray;
    }).then(chunkedArray => {
      let tabs = {
        tab1,
        tab2,
        tab3
      };
      res.render("index", {
        title: "Express",
        addToList,
        csrfToken: req.csrfToken(),
        chunkedArray,
        isLogin,
        tabs
      });
    });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
