const listingSchema = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review");
const ExpressError = require("./utils/expresserror.js");
const reviewSchema = require("./schema.js");

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list || !list.owner || !list.owner._id.equals(res.locals.curuser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review || !review.author || !review.author._id.equals(res.locals.curuser._id)) {
        req.flash("error", "You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validate = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(", ");
        return next(new ExpressError(400, msg));
    }
    next();
};

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(", ");
        return next(new ExpressError(400, msg));
    }
    next();
};
