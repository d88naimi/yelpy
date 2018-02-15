var PORT = process.env.PORT || 3000;
var express     = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
flash       = require("connect-flash"),
passport    = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride = require("method-override"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
User        = require("./models/user"),
seedDB      = require("./seeds")

//requring routes
var commentRoutes    = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes      = require("./routes/index")

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useMongoClient: true
    });
} else {
    mongoose.connect("mongodb://localhost/yelp_camp", {
        useMongoClient: true
    });
}

// mongoose.connect("mongodb://heroku_nbwfq4n5:p25uli1f98lbqnchs0hb0hr6b0@ds243285.mlab.com:43285/heroku_nbwfq4n5");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
secret: "Once again Rusty wins cutest dog!",
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
res.locals.currentUser = req.user;
res.locals.error = req.flash("error");
res.locals.success = req.flash("success");
next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(PORT, function () {
    console.log("App listening on PORT 3000 Davey: " + PORT);
});