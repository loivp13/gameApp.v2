const User = require("../models/user");

module.exports = User.findById(username, function(err, user) {
  if (err) {
    res.redirect("/profile");
    res.flash("Cannot find user");
  }
  user.cart = cart;
  req.flash("userError", "Unable to find user");
  user.save(function(err, user) {
    if (err) {
    }
  });
});
