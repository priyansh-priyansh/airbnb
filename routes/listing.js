const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing = (req , res , next) => {
    let {error} =  listingSchema.validate(req.body);
        
        if(error) {
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400 , errMsg);
        } else {
          next();
        }
  }

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));
  
  router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }));
  
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }));
  
  router.post("/",validateListing, wrapAsync(async (req, res , next) => {
      
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
  
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", validateListing,wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.flash("success" , "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.flash("success" , "New Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;