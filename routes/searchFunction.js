var express = require("express");
var router = express.Router();
let SearchFunction = require("./Actions/SearchFunction");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    let tab1 = 1,
      tab2 = 2,
      tab3 = 3;
    let querySearch = req.query.name;
    const searchedDataArray = await SearchFunction(querySearch);
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
      title: "Express",
      chunkedArray,
      csrfToken: req.csrfToken(),
      tabs
    });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
