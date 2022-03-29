const path = require("path");

const fileUpload = require("express-fileupload");
const express = require("express");
const mongoose = require("mongoose");
const rateLimit= require("express-rate-limit");
const helmet = require("helmet") 
const mongoSanitize = require("express-mongo-sanitize");
const xss = require('xss-clean')
const hpp = require('hpp')

const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dotenv = require("dotenv");
const AppError = require("./utils/appError")
const globalErrorController = require("./controllers/errorController")


process.on('uncaughtException', err=>{
  console.log(err.name,err.message);
  console.log("uncaughtException!! shut down...");
  process.exit(1)

})

// load config
dotenv.config({ path: "./config/config.env" });

const app = express();


// 1 global middleware
app.use(helmet())

if(process.env.NODE_ENV === "development"){
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max:3, 
  windowMs : 60 * 60 * 1000 , //1uhr
  message : 'Too many request from this IP , please try agin in an hour'
});

app.use('/',limiter);

// database connection
// connectDB();
const DB = process.env.MONGO_URI.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
  })
  .then(() => {
    () => console.log("DB connection successful!");
  });

//* Passwport Configuration
require("./config/passport");





//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// view engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/masterLayouts");
app.set("views", path.join(__dirname, "views"));

//* BodyPaser
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '10kb'}));

//data sanitization agaubst nosql query injection
app.use(mongoSanitize());

//Data sanitization agaubst XSS
app.use(xss())



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
app.use(express.static(path.join(__dirname, "public")));

//* routes
app.use("/", require("./routes/blog"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/resume", require("./routes/resume-firstpage"));


//& 404 page
app.all('*',require("./controllers/errorController").get404)
// app.all('*',require("./controllers/errorController").get404)

app.use(globalErrorController.global)

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () =>
//   console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
// );
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err=>{
  console.log(err.name,err.message);
  console.log("unhandeledRejection!! shut down...");
  server.close(()=>{
    process.exit(1)
  })
})

