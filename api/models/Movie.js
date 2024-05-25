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
    premium: { type: Boolean, default: false },
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
/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the movie
 *         title1:
 *           type: string
 *           description: Another title of the movie
 *         description:
 *           type: string
 *           description: Description of the movie
 *         img:
 *           type: string
 *           description: URL of the main image associated with the movie
 *         imgTitle:
 *           type: string
 *           description: Title of the main image
 *         thumbnail:
 *           type: string
 *           description: URL of the thumbnail image
 *         trailer:
 *           type: string
 *           description: URL of the movie trailer
 *         video:
 *           type: string
 *           description: URL of the movie video
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date of the movie
 *         Age:
 *           type: integer
 *           description: Age restriction for the movie
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of genres associated with the movie
 *         isSeries:
 *           type: boolean
 *           description: Indicates if the movie is a series
 *         premium:
 *           type: boolean
 *           description: Indicates if the movie is premium content
 *         rating:
 *           type: number
 *           description: Rating of the movie
 *         duration:
 *           type: string
 *           description: Duration of the movie
 *         director:
 *           type: string
 *           description: Director of the movie
 *         actors:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of actors in the movie
 *         language:
 *           type: string
 *           description: Language of the movie
 *         country:
 *           type: string
 *           description: Country of production of the movie
 *         uploadedBy:
 *           type: string
 *           description: ID of the user who uploaded the movie
 *         views:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID of the user who viewed the movie
 *               count:
 *                 type: number
 *                 description: Number of times the movie has been viewed by the user
 *       required:
 *         - title
 *         - title1
 *         - uploadedBy
 */
