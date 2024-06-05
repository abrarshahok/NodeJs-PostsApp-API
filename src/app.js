const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed.js");
const authRoutes = require("./routes/auth.js");
const { fileStorage, fileFilter } = require("./middlewares/image-upload.js");
const isAuth = require("./middlewares/is-auth.js");

const app = express();

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(path.resolve(), "/images")));

// Prevent CORS Error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

app.use("/feed", isAuth, feedRoutes);
app.use("/auth", authRoutes);

const uri = "YOUR URI";

mongoose
  .connect(uri)
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.set("debug", true);
