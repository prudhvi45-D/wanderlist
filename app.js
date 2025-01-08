if(process.env.NODE_ENV != "production")
{
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/expresserror.js");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const listingsrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const usersrouter=require("./routes/user.js");
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const db_url=process.env.Atlasdb_url;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
//sessions

const store= MongoStore.create({
    mongoUrl:db_url,
    crypto:
    {
        secret:process.env.secret,
    },
    touchAfter:24*3600,
});
const sessionoptions={
    store,
    secret:process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    },
};
app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curuser=req.user;
    next();
});

//demo
app.get("/demo",async(req,res)=>
{
    let fakeuser=new User(
        {
            email:"prudhvi@gmail",
            username:"prudhvi",
        }
    )
    let registerid= await User.register(fakeuser,"hello");
    res.send(registerid);
})




// Validation Middleware




app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",usersrouter);
// Database Connection
mongoose.connect(db_url)
    .then(() => console.log("Connection successful"))
    .catch(err => console.log(err));

// 404 Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("lists/error.ejs", { message, status });
});

// // Root Route
// app.get("/", (req, res) => {
//     res.send("Route success");
// });

app.listen(3000, () => {
    console.log("App is listening on server 3000");
});
