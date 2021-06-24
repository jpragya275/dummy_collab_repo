const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      trim: true,
      maxlength: [40, "A product name must have less than 40 characters"],
      minlength: [6, "A product name must have more than 6 characters"],
    },
    originalPrice: {
      type: Number,
      required: [true, "A product must have originalPrice"],
    },
    discountedPrice: {
      type: Number,
      required: [true, "A product must have discountedPrice"],
      validate:{
        validator:function(value) {
          // This only ppoints while creating NEW doc and not updating
          return value<this.originalPrice;
        },
        message: "Discount price {{VALUE}} must be less than  regular price"
      }
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: [true, "A product must have description"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "A product must have size"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "A product must have color"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    occasion: {
      type: String,
      required: [true, "A product must have occasion"],
      trim: true,
    },
    season: {
      type: String,
      required: [true, "A product must have season"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "A product must have category"],
      trim: true,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
