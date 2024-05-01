const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");
const axios = require("axios");

// CREATE
router.post("/", verify, async (req, res) => {
  try {
    // Fetch user role using Axios
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is authorized to create a list
    if (roleName === "Admin") {
      const newList = new List(req.body);
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    // Fetch user role using Axios
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is authorized to delete a list
    if (roleName === "Admin") {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("The list has been deleted...");
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    // Fetch user role using Axios
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is authorized to update a list
    if (roleName === "Admin") {
      const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedList);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
