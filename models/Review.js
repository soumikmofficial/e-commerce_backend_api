const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a star rating"],
      default: 5,
    },
    title: {
      type: String,
      trim: true,
      maxLength: [100, `Title shouldn't exceed 100 characters`],
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating) || 0,
        numberOfReviews: result[0]?.numberOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
