const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");

main()
  .then(() => {
    console.log("Connect to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi i am root");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My New villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute , Goa",
    country: "India",
  });

  await sampleListing.save();
  console.log("Sample was saved");
  res.send("Successful testing");
});

app.listen(8080, () => {
  console.log("Listening at port 8080");
});
