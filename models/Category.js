const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: { type: String, require: true },
  slug: { type: String, required: true },
});

model.exports = mongoose.model("Category", categorySchema);
