const mongoose = require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose

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
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    views: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Series", SeriesSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Episode:
 *       type: object
 *       properties:
 *         episodeNumber:
 *           type: number
 *           description: The episode number
 *           example: 1
 *         title:
 *           type: string
 *           description: The title of the episode
 *           example: "Episode 1"
 *         description:
 *           type: string
 *           description: The description of the episode
 *         duration:
 *           type: string
 *           description: The duration of the episode
 *         thumbnail:
 *           type: string
 *           description: The thumbnail URL of the episode
 *         url:
 *           type: string
 *           description: The URL of the episode
 *
 *     Season:
 *       type: object
 *       properties:
 *         seasonNumber:
 *           type: number
 *           description: The season number
 *           example: 1
 *         episodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Episode'
 *
 *     Series:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the series
 *           example: "Game of Thrones"
 *         description:
 *           type: string
 *           description: The description of the series
 *         thumbnail:
 *           type: string
 *           description: The thumbnail URL of the series
 *         rating:
 *           type: number
 *           description: The rating of the series
 *           example: 8.9
 *         genre:
 *           type: array
 *           description: The genres of the series
 *           items:
 *             type: string
 *         language:
 *           type: string
 *           description: The language of the series
 *           example: "English"
 *         country:
 *           type: string
 *           description: The country of origin of the series
 *           example: "USA"
 *         seasons:
 *           type: array
 *           description: The seasons of the series
 *           items:
 *             $ref: '#/components/schemas/Season'
 *         uploadedBy:
 *           type: string
 *           description: The ID of the user who uploaded the series
 *           example: "615e705b689ad2b9d5e9d628"
 *         views:
 *           type: array
 *           description: The views of the series
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user who viewed the series
 *                 example: "615e705b689ad2b9d5e9d628"
 *               count:
 *                 type: number
 *                 description: The count of views by the user
 *                 example: 1
 *       required:
 *         - title
 */