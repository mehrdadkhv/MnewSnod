const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  post: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
});

model.exports = mongoose.model("Category", categorySchema);
