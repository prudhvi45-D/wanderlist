
const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let nreview = new Review(req.body.review);
    nreview.author = req.user._id;
    listing.review.push(nreview);
    await nreview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewid } });
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};
