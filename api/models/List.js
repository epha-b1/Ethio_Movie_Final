const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    type: { type: String },
    genre: { type: String },
    content: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", ListSchema);
/**
 * @swagger
 * components:
 *   schemas:
 *     List:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the list
 *         type:
 *           type: string
 *           description: The type of the list (e.g., "movie", "series", etc.)
 *         genre:
 *           type: string
 *           description: The genre of the list
 *         content:
 *           type: array
 *           items:
 *             type: object
 *             description: Content items in the list
 *       required:
 *         - title
 */