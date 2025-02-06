const { listingSchema, reviewSchema } = require("../schema.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    return res.redirect(`/listings/${listing._id}`);
  }

  module.exports.destroyReview = async (req, res) => {
    let { id, reviewID } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const review = await Review.findById(reviewID);
    if (!review || !review.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to delete this review!");
      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });

    const deletedReview = await Review.findByIdAndDelete(reviewID);
    if (!deletedReview) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    req.flash("success", "Review Deleted!");
    return res.redirect(`/listings/${id}`);
  }