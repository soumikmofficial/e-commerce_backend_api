const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a product name"],
      trim: true,
      maxLength: [100, "Name must not exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please end a valid price value"],
      default: 0,
    },
    description: {
      type: String,
      required: true,
      maxLength: [1000, "Description must not exceed 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/default.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide a company"],
      enum: {
        values: ["ikea", "godrej", "neelkamal"],
        message: "{VALUE} not supported",
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "Must specify stock size"],
      default: 10,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", productSchema);
