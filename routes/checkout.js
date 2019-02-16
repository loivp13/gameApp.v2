var express = require("express");
var router = express.Router();
let SearchFunction = require("./Actions/SearchFunction");

//render checkout page
router.post("/", function(req, res, next) {
  res.render("checkout");
});
module.exports = router;
