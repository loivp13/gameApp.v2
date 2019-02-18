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
        if (!object.original_release_date) {
          object.original_release_date = "TBA";
        }

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
