const mongoose = require("mongoose");
const slugify = require("slugify");
const ParentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("ParentCategory", categorySchema);
