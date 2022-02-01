const mongoose = require("mongoose");

const { schema } = require("./secure/postValidation");

const postShema = new mongoose.Schema({
  title: {
    type: String,

    trim: true,
    minLength: 5,
    maxLength: 100,
  },
  summary: {
    type: String,
  },
  body: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["new", "hot", "public", "private"],
    default: "public",
  },
  thumbnail: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postShema.statics.postValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Post", postShema);
