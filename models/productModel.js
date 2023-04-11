const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
      trim: true,
      maxLength: [45, "A product name must have less than 45 characters"],
      minLength: [5, "A product name must have more than 5 characters"],
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "A product name must have a price"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "A tour must have at least 0 rating"],
      max: [5, "A tour must have at most 5 ratings"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
    },
    photo: {
      type: String,
      required: [true, "A product must have a image"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ price: 1, ratingsAverage: 1 });
productSchema.index({ slug: 1 });

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.post(/^find/, function (docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
