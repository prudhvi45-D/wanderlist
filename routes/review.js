
const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync");
const { isloggedin, isAuthor } = require("../middlware");
const reviewController = require("../controallers/review.js");

// Posting reviews
router.post("/", isloggedin, wrapasync(reviewController.createReview));

// Deleting reviews
router.delete("/:reviewid", isloggedin, isAuthor, wrapasync(reviewController.deleteReview));

module.exports = router;
