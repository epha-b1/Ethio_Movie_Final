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

    if (roleName === "Admin" || roleName === "Content_Creator") {
      const newSeries = new Series({
        ...req.body,
        uploadedBy: req.user.id
      });
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
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json("Series not found");
    }
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Admin" || req.user.id === series.uploadedBy.toString()) {
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
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json("Movie not found");
    }
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    if (roleName === "Admin" || req.user.id === series.uploadedBy.toString()) {
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

    if (roleName === "Admin" || roleName === "Content_Creator") {
      let series;
      if (roleName === "Admin"){
        series = await Series.find().sort({ _id: -1 });
      }else{
        series = await Series.find({uploadedBy:req.user.id}).sort({ _id: -1 });
      }
      res.status(200).json(series);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update view count for a movie
// router.post("/:id/views", async (req, res) => {
//   try {
//     const seriesId = req.params.id;
//     const series = await Movie.findById(seriesId);
//     if (!series) {
//       return res.status(404).json({ message: "Series not found" });
//     }
//     series.views += 1;
//     await series.save();
//     res.json({ message: "View count updated successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/:id/views", verify, async (req, res) => {
  try {
    const seriesId = req.params.id;
    const userId = req.user.id; // Assuming the user's ID is provided in the request user object

    // Validate series ID and user ID
    if (!seriesId || !userId) {
      return res.status(400).json({ message: 'Missing series ID or user ID' });
    }

    // Find the series by ID
    const series = await Series.findById(seriesId);
    if (!series) {
      return res.status(404).json({ message: 'Series not found' });
    }

    // Ensure that the views array is initialized
    series.views = series.views || [];

    // Check if the user has already viewed the series
    const viewerIndex = series.views.findIndex(view => view.user && view.user.toString() === userId);
    if (viewerIndex !== -1) {
      // If the user has already viewed the series, increment their view count
      series.views[viewerIndex].count += 1;
    } else {
      // If the user hasn't viewed the series yet, add them to the views array
      series.views.push({ user: userId, count: 1 });
    }

    // Save the updated series document
    await series.save();

    return res.status(200).json({ message: 'View recorded successfully' });
  } catch (error) {
    console.error('Error recording view:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



/**
 * @swagger
 * tags:
 *   name: Series
 *   description: API endpoints for managing series
 */

/**
 * @swagger
 * /api/series:
 *   post:
 *     summary: Create a new series
 *     description: Creates a new series if the user is authorized.
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Series'
 *     responses:
 *       201:
 *         description: Series created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Series'
 *       403:
 *         description: User is not allowed to create a series
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/series/{id}:
 *   put:
 *     summary: Update a series
 *     description: Updates a series if the user is authorized.
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the series to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Series'
 *     responses:
 *       200:
 *         description: Series updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Series'
 *       403:
 *         description: User is not allowed to update the series
 *       404:
 *         description: Series not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/series/{id}:
 *   delete:
 *     summary: Delete a series
 *     description: Deletes a series if the user is authorized.
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the series to delete
 *     responses:
 *       200:
 *         description: Series deleted successfully
 *       403:
 *         description: User is not allowed to delete the series
 *       404:
 *         description: Series not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/series/find/{id}:
 *   get:
 *     summary: Get a series by ID
 *     description: Retrieves a series by its ID.
 *     tags: [Series]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the series to retrieve
 *     responses:
 *       200:
 *         description: Series retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Series'
 *       404:
 *         description: Series not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/series/random:
 *   get:
 *     summary: Get a random series
 *     description: Retrieves a random series.
 *     tags: [Series]
 *     responses:
 *       200:
 *         description: Random series retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Series'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/series:
 *   get:
 *     summary: Get all series
 *     description: Retrieves all series if the user is authorized.
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of series
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Series'
 *       403:
 *         description: User is not allowed to retrieve series
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/series/{id}/views:
 *   post:
 *     summary: Record a view for a series
 *     description: Records a view for a series if the user is authorized.
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the series to record the view for
 *     responses:
 *       200:
 *         description: View recorded successfully
 *       400:
 *         description: Missing series ID or user ID
 *       404:
 *         description: Series not found
 *       500:
 *         description: Internal server error
 */

module.exports = router;
