const Listing = require("../models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token = process.env.Map_token;
const geocodingClient = mbxgeocoding({ accessToken: map_token });


module.exports.searchListing = async (req, res) => {
    try {
        console.log("Received Query Parameters:", req.query); // Log received query
        console.log("Route Parameters:", req.params); 
        
        const query = req.query.title?.trim(); 

        if (!query || query.length < 1) {
            return res.status(400).json({ error: "Search query is required." });
        }

        const results = await Listing.find(
            { title: { $regex: query, $options: "i" } },
            { _id: 1, title: 1, owner: 1 } 
        ).populate("owner");
        
        const id = results[0]?._id; // Using optional chaining to avoid errors if no result is found
        if (!id) {
            return res.status(404).json({ error: "No results found for the given query." });
        }

        const list = await Listing.findById(id)
            .populate({ path: "review", populate: { path: "author" } })
            .populate("owner");

        if (!list) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }

        // Render the show page with the found listing
        res.render("lists/show.ejs", { list });

        console.log(list);
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error during search:", error);

        // Respond with a detailed error message
        req.flash("error", "An error occurred while processing your request. Please try again later.");
        res.redirect("/listings");
    }
};

// Existing controller functions
module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("lists/index.ejs", { alllistings });
};

module.exports.newlist = (req, res) => {
    res.render("lists/new.ejs");
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const list = new Listing(req.body.listing);
    list.image = { url, filename };
    list.owner = req.user._id;
    list.geometry = response.body.features[0].geometry;
    await list.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
};

module.exports.showEditForm = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalimage = list.image.url;
    originalimage = originalimage.replace("/upload", "/upload/w_250,e_blur:100");
    res.render("lists/edit.ejs", { list, originalimage });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file !== undefined) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        listing.owner = req.user._id;
        await listing.save();
    }
    req.flash("success", "Updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
        .populate({ path: "review", populate: { path: "author" } })
        .populate("owner");
    if (!list) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("lists/show.ejs", { list });
};

