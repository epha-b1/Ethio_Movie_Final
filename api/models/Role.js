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
