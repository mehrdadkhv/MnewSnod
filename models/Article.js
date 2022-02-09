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
    body: {
      type: String,
      required: true,
    },
    categories: [
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

articleSchema.virtual("category", {
  ref: "Category",
  localField: "_id",
  foreignField: "article",
});

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Article", articleSchema);
