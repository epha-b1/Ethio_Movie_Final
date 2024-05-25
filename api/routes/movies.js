const router = require("express").Router();
const Movie = require("../models/Movie");
const User = require('../models/User');

const verify = require("../verifyToken");
const axios = require("axios");

// CREATE
router.post("/", verify, async (req, res) => {
  try {
    // Make an API call to fetch the user's role
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is either an Admin or a Content Creator
    if (roleName === "Admin" || roleName === "Content_Creator") {
      const newMovie = new Movie({
        ...req.body,
        uploadedBy: req.user.id, // Associate the movie with the authenticated user
      });
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } else {
      res.status(403).json("You are not allowed to upload movies");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    // Fetch the movie by ID
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json("Movie not found");
    }
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the authenticated user is the uploader or an admin
    if (roleName === "Admin" || req.user.id === movie.uploadedBy.toString()) {
      // Update the movie
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } else {
      res.status(403).json("You are not allowed to update this movie");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    // Fetch the movie by ID
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json("Movie not found");
    }
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;
    // Check if the authenticated user is the uploader or an admin
    if (roleName === "Admin" || req.user.id === movie.uploadedBy.toString()) {
      // Delete the movie
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
    } else {
      res.status(403).json("You are not allowed to delete this movie");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json("Movie not found");
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET RANDOM
router.get("/random", verify, async (req, res) => {
  try {
    const type = req.query.type;
    const movie = await Movie.aggregate([
      { $match: { isSeries: type === "series" } },
      { $sample: { size: 1 } },
    ]);
    res.status(200).json(movie);
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
      let movies;
      if (roleName === "Admin") {
        // If the user is an admin, retrieve all movies
        movies = await Movie.find().sort({ _id: -1 });
      } else {
        // If the user is a content creator, retrieve movies uploaded by the creator
        movies = await Movie.find({ uploadedBy: req.user.id }).sort({
          _id: -1,
        });
      }
      res.status(200).json(movies);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/allMovie", async (req, res) => {
  try {
    movies = await Movie.find().sort({ _id: -1 });

    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:id/views", verify, async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user.id; // Assuming the user's ID is provided in the request user object

    // Validate movie ID and user ID
    if (!movieId || !userId) {
      return res.status(400).json({ message: 'Missing movie ID or user ID' });
    }

    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Ensure that the views array is initialized
    movie.views = movie.views || [];

    // Check if the user has already viewed the movie
    if (movie.views && movie.views.length > 0) {
      const viewerIndex = movie.views.findIndex(view => view.user && view.user.toString() === userId);
      if (viewerIndex !== -1) {
        // If the user has already viewed the movie, increment their view count
        movie.views[viewerIndex].count += 1;
      } else {
        // If the user hasn't viewed the movie yet, add them to the views array
        movie.views.push({ user: userId, count: 1 });
      }
    } else {
      // If no views exist yet, add the user to the views array
      movie.views.push({ user: userId, count: 1 });
    }

    // Save the updated movie document
    await movie.save();

    return res.status(200).json({ message: 'View recorded successfully' });
  } catch (error) {
    console.error('Error recording view:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// SEARCH
router.get("/search", verify, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Missing search query' });
    }

    // Perform a case-insensitive search for movies whose title or title1 contains the query
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Search in the title field
        { title1: { $regex: query, $options: 'i' } } // Search in the title1 field
      ]
    });

    res.status(200).json(movies);
  } catch (err) {
    console.error('Error searching movies:', err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API endpoints for managing movies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         uploadedBy:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - uploadedBy
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve all movies
 *     description: Retrieve all movies uploaded by an admin or content creator
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /movies/find/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a movie by its ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to get
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /movies/random:
 *   get:
 *     summary: Get a random movie
 *     description: Retrieve a random movie based on the type (series or movie)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type of movie (movie or series)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A random movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies
 *     description: Search movies by title or title1
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /movies/{id}/views:
 *   post:
 *     summary: Record a view for a movie
 *     description: Record a view for a movie with the given ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: View recorded successfully
 *       400:
 *         description: Missing movie ID or user ID
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     description: Only admins or content creators can upload movies
 *     tags: [Movies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Update a movie with the given ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Updated movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Delete a movie with the given ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /movies/allMovie:
 *   get:
 *     summary: Retrieve all movies (public access)
 *     description: Retrieve all movies regardless of user role (public access)
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error
 */

module.exports = router;
