const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validatecampground } = require("../middleware");

router.get("/", catchAsync(campgrounds.index));
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router.post(
  "/",
  isLoggedIn,
  validatecampground,
  catchAsync(campgrounds.createCampground)
);

router.get("/:id", catchAsync(campgrounds.showCampground));
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampgroundForm)
);
router.put(
  "/:id",
  validatecampground,
  isAuthor,
  catchAsync(campgrounds.updateCampground)
);
router.delete("/:id", isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
