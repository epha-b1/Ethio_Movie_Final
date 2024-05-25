const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    enum: ["User", "Admin", "Content_Creator"],
  },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Role", roleSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         role_name:
 *           type: string
 *           description: The name of the role
 *           enum:
 *             - User
 *             - Admin
 *             - Content_Creator
 *       required:
 *         - role_name
 */