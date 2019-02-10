var express = require("express");
var router = express.Router();
let SearchFunction = require("./Actions/SearchFunction");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    let addToList = req.query.addGame;
    let searchedDataArray = await SearchFunction();
    res.render("index", {
      title: "Express",
      searchedDataArray,
      addToList,
      csrfToken: req.csrfToken()
    });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
