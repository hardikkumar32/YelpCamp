const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
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
const check = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; ++i) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const c = new Campground({
      author: "62372310a7322f09c573c1e5",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "ipsum dolor sit amet consectetur adipisicing elit. Voluptatum autem aliquid animi, omnis sapiente enim qui illum placeat, cupiditate consequatur veritatis praesentium minus, unde cum quo nam necessitatibus officia numquam.",
      price,
    });
    await c.save();
  }
};
check();
