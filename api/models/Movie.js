const mongoose = require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose

const MovieSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    title1: { type: String, required: true, unique: true },
    description: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    thumbnail: { type: String },
    trailer: { type: String },
    video: { type: String },
    releaseDate: { type: Date },
    Age: { type: Number },
    genre: [String],
    isSeries: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    duration: { type: String },
    director: { type: String },
    actors: { type: Array },
    language: { type: String },
    country: { type: String },
    uploadedBy: {
      type: Schema.Types.ObjectId, // Assuming phoneNumber is stored as a string
      ref: "User",
      required: true,
    },
    views: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
