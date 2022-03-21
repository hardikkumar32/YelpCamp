const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validatecampground } = require("../middleware");

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.post(
  "/",
  isLoggedIn,
  validatecampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfuly made a new campground");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  validatecampground,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
router.delete(
  "/:id",
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted camground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
