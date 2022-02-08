const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Category",
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },
  { toObject: { virtuals: true } }
);

categorySchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Category", categorySchema);
