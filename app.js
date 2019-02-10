const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const favicon = require("serve-favicon");
const validator = require("express-validator");
const mongoose = require("mongoose");
const session = require("express-session");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const searchRouter = require("./routes/searchFunction");
const passport = require("passport");
const flash = require("connect-flash");
console.log("starting");
const app = express();

//connect to mongodb
const mongoDB =
  "mongodb://masterveloute:Heyheyhey3@ds023684.mlab.com:23684/game_app";
mongoose.connect(mongoDB);

//use Passport config
require("./config/passport");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("view cache", false);

//use favicon
app.use(
  favicon(path.join(__dirname, "public", "images", "favicon", "favicon.ico"))
);

//use logger
app.use(logger("dev"));
//use sassMiddleware
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);

app.use(express.static(path.join(__dirname, "public")));

//use body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//use cookieParser
app.use(cookieParser());

//use express-session
app.use(
  session({
    secret: "dhfpaiojdhfopshdapfsapfoidnfopsangspd",
    resave: true,
    saveUninitialized: true
  })
);
//connect flash for messages
app.use(flash());
//require in and use express messages
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
//express validator middleware
app.use(
  validator({
    errorFormatter: function(param, msg, value) {
      let namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += `[${namespace.shift()}]`;
      }

      return {
        param: formParam,
        msg,
        value
      };
    }
  })
);
// start passport in session
app.use(passport.initialize());
app.use(passport.session());

//Enable CSRF Protection
const csrf = require("csurf");
const csrfProtection = csrf();
app.use(csrfProtection);

//Adding variables for app.locals 
app.use("/", function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.cart = req.session.cart;
  next();
});

//Express routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/searchGame", searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
