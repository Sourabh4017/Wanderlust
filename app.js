if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js")

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Cannected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60,
});


store.on("error", function(e){
    console.log("session store error", err);
});

const sessionOption = { 
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/registerUser", async (req, res) => {
// let fakeUser = new User({
// email: "student@gmail.com",
// username: "delta-student",
// }) ;
// let newUser = await User.register(fakeUser, "helloworld");
// res.send(newUser) ;
// });

// const validateListing = (req, res, next) => {
//     let {error} = listingSchema.validate(req.body); //joi use validation
//     if(error){
//         throw new ExpressError(400, result.error);
//     }else{
//         next();
//     }
// }


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new expressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="somthing want wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is lestening to port 8080");
});