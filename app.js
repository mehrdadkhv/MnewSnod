const path = require("path");

const debug = require("debug")("weblog-project");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const dotEnv = require("dotenv");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const connectDB = require("./config/db");
const winston = require("./config/winston");

// load config
dotEnv.config({ path: "./config/config.env" });

// database connection
connectDB();
debug("Connecting to Database");

//* Passwport Configuration
require("./config/passport");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// loggin routes
if (process.env.NODE_ENV === "development") {
  // debug("Morgan Enabale");
  // app.use(morgan("combined", { stream: winston.stream }));
}

// view engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/masterLayouts");
app.set("views", "views");

//* BodyPaser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// file upload middleware

app.use(fileUpload());

//* session

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, //modify nashod sab nashe
    unset: "destroy",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//* Passport

app.use(passport.initialize());
app.use(passport.session());

//  Flash
app.use(flash()); //req.flash

// static folder
app.use(express.static(path.join(__dirname, "/public")));

//* routes
app.use("/", require("./routes/blog"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

//& 404 page
app.use(require("./controllers/errorController").get404);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
