const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  required: true,
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
});

model.exports = mongoose.model("Category", categorySchema);
