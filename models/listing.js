const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListeningSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default : "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/0e/1d/49/ce/37/v1_E11/E1136TZR.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=adab2d753f94d72c96aa1aaa5160ea2bfea072cbf2f0b3471dbc849796c55ca5",
    set: (v) =>
      v === ""
        ? "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/0e/1d/49/ce/37/v1_E11/E1136TZR.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=adab2d753f94d72c96aa1aaa5160ea2bfea072cbf2f0b3471dbc849796c55ca5"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", ListeningSchema);
module.exports = Listing;
