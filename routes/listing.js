const express = require('express');
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isloggedin, isOwner, validate } = require("../middlware.js");
const controller = require("../controallers/listing.js");
const multer  = require('multer')
const {storage} =require('../cloudconfig.js');
const upload = multer({ storage })

router.route("/")
    .get(wrapasync(controller.index))  
    .post(isloggedin,upload.single('listing[image]'), validate, wrapasync(controller.createListing));  

// New Listing Form
router.route("/new")
    .get(isloggedin, controller.newlist); 

// Edit Form
router.route("/:id/edit")
    .get(isloggedin, wrapasync(controller.showEditForm));  

// Update Listing
router.route("/:id")
    .put(isloggedin,upload.single('listing[image]'), isOwner, validate, wrapasync(controller.updateListing))  // PUT to update the listing
    .delete(isloggedin, isOwner, wrapasync(controller.deleteListing));  // DELETE to delete the listing

// Show Listing
router.route("/:id")
    .get(wrapasync(controller.showListing));  // GET to show a specific listing

module.exports = router;