const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  name: {
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
  ancestors: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true,
      },
      name: String,
      slug: String,
    },
  ],
});

categorySchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, string: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
