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

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: API endpoints for managing lists
 */

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new list
 *     description: Creates a new list.
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/List'
 *     responses:
 *       201:
 *         description: New list created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       403:
 *         description: Unauthorized, only Admin can create a list
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Delete a list
 *     description: Deletes a list by ID.
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the list to delete
 *     responses:
 *       200:
 *         description: List deleted successfully
 *       403:
 *         description: Unauthorized, only Admin can delete a list
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get lists
 *     description: Retrieve a list of lists based on optional query parameters.
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type of list (optional)
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Genre of list (optional)
 *     responses:
 *       200:
 *         description: List of lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/lists/{id}:
 *   put:
 *     summary: Update a list
 *     description: Updates a list by ID.
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the list to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/List'
 *     responses:
 *       200:
 *         description: List updated successfully
 *       403:
 *         description: Unauthorized, only Admin can update a list
 *       500:
 *         description: Internal server error
 */
