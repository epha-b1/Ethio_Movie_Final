const router = require("express").Router();
const Role = require("../models/Role"); // Assuming you have a Role model

// GET all roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a role by ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
