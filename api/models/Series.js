const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: String },
  thumbnail: { type: String },
  url: { type: String },
});

const SeasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  episodes: [EpisodeSchema],
});

const SeriesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    rating: { type: Number },
    genre: { type: [String] },
    language: { type: String },
    country: { type: String },
    seasons: [SeasonSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Series", SeriesSchema);
