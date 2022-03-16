const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
// const Joi = require("joi");
const { campgroundSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const Campground = require("./models/campground");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const validatecampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, "400");
  } else next();
};

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post(
  "/campgrounds",
  validatecampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
  })
);
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
app.put(
  "/campgrounds/:id",
  validatecampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    res.redirect(`/campgrounds/${campground.id}`);
  })
);
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", "404"));
});
app.use((err, req, res, next) => {
  const { message = "oh no error", statusCode = "500" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error", { err });
  // res.send("Oh boy, something went wrong");
});
app.listen(3000, () => {
  console.log("serving on port 3000");
});
