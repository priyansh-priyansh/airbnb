const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main() 
.then(() => {
    console.log("Connect to DB");
})
.catch((err) => {
    console.log(err);
});



async function main() {
 await mongoose.connect(MONGO_URL);
};

app.get("/" , (req,res) => {
    res.send("Hi i am root");
});

app.listen(8080 , () => {
    console.log("Listening at port 8080");
});
