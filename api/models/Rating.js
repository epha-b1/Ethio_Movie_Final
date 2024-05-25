const mongoose = require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose


const RatingSchema = new Schema({
    movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: String, ref: 'User', required: true }, // Reference User model
    rating: { type: Number, required: true, min: 0, max: 5 },
  });

  module.exports = mongoose.model("Rating", RatingSchema);
