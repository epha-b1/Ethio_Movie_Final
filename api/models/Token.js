const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 3600 } // Token expires after 1 hour
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the token
 *           example: "60d8f05d1e81ab12c8da1bfe"
 *         token:
 *           type: string
 *           description: The token value
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the token
 *           example: "2024-05-27T10:00:00.000Z"
 *       required:
 *         - userId
 *         - token
 *         - createdAt
 */
