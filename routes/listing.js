const express = require('express');
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isloggedin, isOwner, validate } = require("../middlware.js");
const controller = require("../controallers/listing.js");
const multer = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });
// Search route
router.get("/search", wrapasync(controller.searchListing));
// Existing routes
router.route("/")
    .get(wrapasync(controller.index))  
    .post(isloggedin, upload.single('listing[image]'), validate, wrapasync(controller.createListing));  

router.route("/new")
    .get(isloggedin, controller.newlist); 

router.route("/:id/edit")
    .get(isloggedin, wrapasync(controller.showEditForm));  

router.route("/:id")
    .put(isloggedin, upload.single('listing[image]'), isOwner, validate, wrapasync(controller.updateListing))  
    .delete(isloggedin, isOwner, wrapasync(controller.deleteListing))  
    .get(wrapasync(controller.showListing));  


module.exports = router;