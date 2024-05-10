const router = require("express").Router();
const Series = require("../models/Series");
const verify = require("../verifyToken");
const axios = require("axios");

// CREATE
router.post("/", verify, async (req, res) => {
  try {
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Admin") {
      const newSeries = new Series(req.body);
      const savedSeries = await newSeries.save();
      res.status(201).json(savedSeries);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Admin") {
      const updatedSeries = await Series.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedSeries);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Admin") {
      await Series.findByIdAndDelete(req.params.id);
      res.status(200).json("The series has been deleted...");
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
router.get("/find/:id", verify, async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json("series not found");
    }
    res.status(200).json(series);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET RANDOM
router.get("/random", verify, async (req, res) => {
  try {
    const series = await Series.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).json(series);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get("/", verify, async (req, res) => {
  try {
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Admin") {
      const series = await Series.find().sort({ _id: -1 });
      res.status(200).json(series);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
