if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expresserror.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer");

const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

// Load environment variables
const db_url = process.env.Atlasdb_url || "mongodb://localhost:27017/wanderlist"; // Fallback for local testing
const secret = process.env.secret || "fallbacksecret";

// Set view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); 
app.use("/public", express.static("public"));  // Fix for serving static files

// MongoDB Connection
mongoose.connect(db_url)
    .then(() => console.log("MongoDB Connection Successful"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Session & Flash Configuration
const store = MongoStore.create({
    mongoUrl: db_url,
    crypto: { secret },
    touchAfter: 24 * 3600
});

const sessionOptions = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curuser = req.user;
    next();
});

// Demo Route (for Testing)
app.get("/demo", async (req, res) => {
    let fakeUser = new User({
        email: "prudhvi@gmail.com",
        username: "prudhvi",
    });
    let registeredUser = await User.register(fakeUser, "hello");
    res.send(registeredUser);
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// Root Route (Ensure Home Page Works)
app.get("/", (req, res) => {
    res.render("lists/index.ejs");
});

// 404 Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("lists/error.ejs", { message, status });
});

// Server Listener (Dynamic Port for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
