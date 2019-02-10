var express = require("express");
var router = express.Router();
let SearchFunction = require("./Actions/SearchFunction");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    let querySearch = req.query.name;
    const searchedDataArray = await SearchFunction(querySearch);
    res.render("index", {
      title: "Express",
      searchedDataArray,
      csrfToken: req.csrfToken()
    });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
