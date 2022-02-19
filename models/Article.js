const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [],
    body: {
      type: String,
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    categoryAt: {
      type: String,
      default: Date.now,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  }
  // { virtual: true }
);

articleSchema.virtual("categories", {
  ref: "Category",
  localField: "_id",
  foreignField: "articles",
});

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Article", articleSchema);
