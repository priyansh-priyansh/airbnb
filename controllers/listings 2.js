const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "username email",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error("Error showing listing:", err);
    req.flash("error", "Error loading listing");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    // Check if location was found
    if (!response.body.features[0]) {
      req.flash("error", "Location not found. Please try a different location.");
      return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Save geometry data
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    req.flash("success", "New listing Created!");
    return res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // 
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!"); // 
  return res.redirect(`/listings/${id}`); // 
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing Deleted!"); // 
  return res.redirect("/listings"); // 
};
