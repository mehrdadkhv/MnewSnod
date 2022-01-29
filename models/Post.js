const mongoose = require("mongoose");

const { schema } = require("./secure/postValidation");

const postShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 100,
  },
  summary: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["new", "hot"],
    default: "",
  },
  thumbnail: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postShema.statics.postValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Post", postShema);
